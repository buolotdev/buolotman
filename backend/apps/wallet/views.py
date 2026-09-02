from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction as db_transaction

from apps.governance.services import create_notification, create_audit_log

from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer, WithdrawSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wallet_detail(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    serializer = WalletSerializer(wallet)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw_funds(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    serializer = WithdrawSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    amount = serializer.validated_data['amount']
    if not wallet.can_withdraw(amount):
        return Response({"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        wallet.available_balance -= amount
        wallet.total_withdrawn += amount
        wallet.save(update_fields=['available_balance', 'total_withdrawn'])

        Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            type='debit',
            category='withdrawal',
            description=f'Withdrawal of {amount} {wallet.currency}',
            status='pending',
            metadata=serializer.validated_data.get('account_details', {}),
        )
        create_audit_log(
            actor=request.user,
            action="withdrawal_requested",
            entity_type="wallet",
            entity_id=wallet.id,
            summary=f"Withdrawal of {amount} {wallet.currency}",
            metadata={"amount": str(amount), "currency": wallet.currency},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        create_notification(
            user=request.user,
            category="payment",
            title="Withdrawal initiated",
            body=f"Your withdrawal request for {amount} {wallet.currency} has been submitted.",
            link="/dashboard/technician/wallet",
            metadata={"amount": str(amount), "currency": wallet.currency},
        )

    return Response({"message": "Withdrawal initiated", "available_balance": str(wallet.available_balance)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_list(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    transactions = wallet.transactions.all()

    type_filter = request.query_params.get('type')
    if type_filter:
        transactions = transactions.filter(type=type_filter)

    category_filter = request.query_params.get('category')
    if category_filter:
        transactions = transactions.filter(category=category_filter)

    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 20))
    start = (page - 1) * limit
    end = start + limit
    total = transactions.count()

    serializer = TransactionSerializer(transactions[start:end], many=True)
    return Response({
        'results': serializer.data,
        'total': total,
        'page': page,
        'limit': limit,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_transaction_list(request):
    if getattr(request.user, 'role', None) != 'ADMIN':
        return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

    transactions = Transaction.objects.select_related('wallet__user').all().order_by('-created_at')

    type_filter = request.query_params.get('type')
    if type_filter:
        transactions = transactions.filter(type=type_filter)

    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 50))
    start = (page - 1) * limit
    end = start + limit
    total = transactions.count()
    total_in_escrow = sum(w.available_balance for w in Wallet.objects.all()) or 0
    pending_payouts = Transaction.objects.filter(type='withdrawal', status='pending').count()

    data = []
    for tx in transactions[start:end]:
        data.append({
            'id': tx.id,
            'type': tx.type,
            'amount': str(tx.amount),
            'status': tx.status,
            'description': tx.description or '',
            'user_name': tx.wallet.user.get_full_name() or tx.wallet.user.email,
            'user_email': tx.wallet.user.email,
            'created_at': tx.created_at,
        })

    return Response({
        'results': data,
        'total': total,
        'page': page,
        'limit': limit,
        'total_in_escrow': str(total_in_escrow),
        'pending_payouts': pending_payouts,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit_escrow(request):
    from apps.tasks.models import Task

    task_id = request.data.get('task_id')
    bid_id = request.data.get('bid_id')
    amount = request.data.get('amount')

    if not task_id or not amount:
        return Response({"error": "task_id and amount are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user != task.client:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    from decimal import Decimal
    amount = Decimal(str(amount))

    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    bid = None
    if bid_id:
        from apps.tasks.models import Bid
        try:
            bid = Bid.objects.get(id=bid_id)
        except Bid.DoesNotExist:
            return Response({"error": "Bid not found"}, status=status.HTTP_404_NOT_FOUND)

    with db_transaction.atomic():
        wallet.pending_escrow += amount
        wallet.save(update_fields=['pending_escrow', 'updated_at'])

        Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            type='pending',
            category='escrow_hold',
            reference=task,
            description=f"Escrow held for task: {task.title}",
            status='completed',
            metadata={'bid_id': bid_id} if bid_id else {},
        )
        create_audit_log(
            actor=request.user,
            action="escrow_deposited",
            entity_type="wallet",
            entity_id=wallet.id,
            summary=task.title,
            metadata={"task_id": task.id, "bid_id": bid_id, "amount": str(amount)},
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        if bid:
            bid.status = 'accepted'
            from django.utils import timezone
            bid.accepted_at = timezone.now()
            bid.save(update_fields=['status', 'accepted_at'])
            task.status = 'in_progress'
            task.assigned_to = bid.technician
            task.save(update_fields=['status', 'assigned_to'])
            create_notification(
                user=bid.technician,
                category="payment",
                title=f"Escrow funded for {task.title}",
                body="The client has funded the task and it is now active.",
                link=f"/dashboard/technician/tasks/{task.id}",
                metadata={"task_id": task.id, "bid_id": bid.id},
            )
            create_notification(
                user=request.user,
                category="payment",
                title=f"Escrow deposited for {task.title}",
                body="Funds are now held in escrow for your task.",
                link=f"/dashboard/client/tasks/{task.id}",
                metadata={"task_id": task.id, "bid_id": bid.id},
            )

    return Response({
        "message": "Escrow deposited",
        "pending_escrow": str(wallet.pending_escrow),
        "task_status": task.status,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def release_escrow(request, task_id):
    from apps.tasks.models import Task, Bid
    from decimal import Decimal
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    client_wallet, _ = Wallet.objects.get_or_create(user=task.client)
    pending_txs = Transaction.objects.filter(
        wallet=client_wallet,
        reference=task,
        category='escrow_hold',
    )

    amount = Decimal('0.00')

    with db_transaction.atomic():
        if pending_txs.exists():
            pending_tx = pending_txs.first()
            amount = pending_tx.amount
            if client_wallet.pending_escrow >= amount:
                client_wallet.pending_escrow -= amount
            else:
                client_wallet.pending_escrow = Decimal('0.00')
            client_wallet.save(update_fields=['pending_escrow', 'updated_at'])

            if task.assigned_to:
                tech_wallet, _ = Wallet.objects.get_or_create(user=task.assigned_to)
                tech_wallet.available_balance += amount
                tech_wallet.total_earnings += amount
                tech_wallet.save(update_fields=['available_balance', 'total_earnings', 'updated_at'])
                Transaction.objects.create(
                    wallet=tech_wallet,
                    amount=amount,
                    type='credit',
                    category='earnings',
                    reference=task,
                    description=f"Payment received for: {task.title}",
                    status='completed',
                )

            pending_tx.category = 'escrow_release'
            pending_tx.description = f"Escrow released for task {task_id}"
            pending_tx.save(update_fields=['category', 'description'])
        else:
            amount = task.budget_max or task.budget_min or Decimal('0.00')
            if amount > 0 and task.assigned_to:
                tech_wallet, _ = Wallet.objects.get_or_create(user=task.assigned_to)
                tech_wallet.available_balance += amount
                tech_wallet.total_earnings += amount
                tech_wallet.save(update_fields=['available_balance', 'total_earnings', 'updated_at'])
                Transaction.objects.create(
                    wallet=tech_wallet,
                    amount=amount,
                    type='credit',
                    category='earnings',
                    reference=task,
                    description=f"Payment received for: {task.title}",
                    status='completed',
                )

        task.status = 'completed'
        task.save(update_fields=['status'])

        if task.client:
            create_notification(
                user=task.client,
                category="payment",
                title=f"Escrow released for {task.title}",
                body="The escrow funds have been released and the task is now marked completed.",
                link=f"/dashboard/client/projects/{task.id}",
                metadata={"task_id": task.id, "amount": str(amount)},
            )
        if task.assigned_to:
            create_notification(
                user=task.assigned_to,
                category="payment",
                title=f"Payment received for {task.title}",
                body="Escrow release completed and your balance was updated.",
                link="/dashboard/technician/wallet",
                metadata={"task_id": task.id, "amount": str(amount)},
            )

    return Response({"message": "Escrow released", "amount": str(amount)})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit_funds(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    amount = request.data.get('amount')
    payment_method = request.data.get('payment_method', 'Card / Mobile Money')
    if not amount:
        return Response({"error": "amount is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    from decimal import Decimal
    try:
        amount = Decimal(str(amount))
        if amount <= 0:
            raise ValueError()
    except Exception:
        return Response({"error": "Invalid deposit amount"}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        wallet.available_balance += amount
        wallet.save(update_fields=['available_balance', 'updated_at'])

        Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            type='credit',
            category='earnings',
            description=f"Wallet Top-Up via {payment_method}",
            status='completed',
            metadata={'payment_method': payment_method},
        )
        create_audit_log(
            actor=request.user,
            action="wallet_deposit",
            entity_type="wallet",
            entity_id=wallet.id,
            summary=f"Deposited {amount} {wallet.currency} via {payment_method}",
            metadata={"amount": str(amount), "payment_method": payment_method},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        create_notification(
            user=request.user,
            category="payment",
            title="Wallet Deposit Successful",
            body=f"Your wallet has been credited with {amount} {wallet.currency}.",
            link="/dashboard/technician/wallet",
            metadata={"amount": str(amount)},
        )

    return Response({
        "message": "Deposit successful",
        "available_balance": str(wallet.available_balance),
        "currency": wallet.currency,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_subscription_plan(request):
    tier = request.data.get('tier', 'PRO').upper()
    billing_cycle = request.data.get('billing_cycle', 'monthly')
    payment_source = request.data.get('payment_source', 'wallet')

    price_map = {
        'BASIC': {'monthly': 9, 'yearly': 90},
        'PRO': {'monthly': 19, 'yearly': 190},
        'ELITE': {'monthly': 49, 'yearly': 490},
        'ENTERPRISE': {'monthly': 149, 'yearly': 1490},
    }

    if tier not in price_map:
        return Response({"error": "Invalid tier selected"}, status=status.HTTP_400_BAD_REQUEST)

    cost = price_map[tier].get(billing_cycle, price_map[tier]['monthly'])
    from decimal import Decimal
    cost_dec = Decimal(str(cost))

    wallet, _ = Wallet.objects.get_or_create(user=request.user)

    with db_transaction.atomic():
        if payment_source == 'wallet':
            if wallet.available_balance < cost_dec:
                return Response({"error": f"Insufficient wallet balance. You need ${cost} USD. Please top up your wallet first."}, status=status.HTTP_400_BAD_REQUEST)
            wallet.available_balance -= cost_dec
            wallet.save(update_fields=['available_balance', 'updated_at'])

            Transaction.objects.create(
                wallet=wallet,
                amount=cost_dec,
                type='debit',
                category='withdrawal',
                description=f"Subscription upgrade to {tier} ({billing_cycle})",
                status='completed',
                metadata={'tier': tier, 'billing_cycle': billing_cycle},
            )

        tech_prof = getattr(request.user, 'technician_profile', None)
        if tech_prof:
            tech_prof.is_verified = True
            tech_prof.save(update_fields=['is_verified'])

        create_audit_log(
            actor=request.user,
            action="subscription_upgraded",
            entity_type="user",
            entity_id=request.user.id,
            summary=f"Upgraded to {tier} ({billing_cycle})",
            metadata={"tier": tier, "billing_cycle": billing_cycle, "cost": str(cost)},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        create_notification(
            user=request.user,
            category="system",
            title=f"Plan Upgraded to {tier}!",
            body=f"Congratulations! You are now enjoying all {tier} features, higher daily post limits, and priority exposure.",
            link="/upgrade",
            metadata={"tier": tier},
        )

    return Response({
        "message": f"Successfully upgraded to {tier}!",
        "tier": tier,
        "billing_cycle": billing_cycle,
        "available_balance": str(wallet.available_balance),
    })


# =========================================================================
# CamPay Mobile Money Integration (Cameroon - MTN & Orange)
# =========================================================================
from rest_framework.permissions import AllowAny
from .campay_service import (
    campay_collect,
    campay_check_transaction,
    campay_withdraw,
    campay_get_balance,
    format_cameroon_phone,
)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def campay_collect_payment(request):
    """
    Initiates a Mobile Money USSD prompt on customer's MTN/Orange phone.
    Works for:
      1. Escrow Task Funding (requires task_id & optional bid_id)
      2. Wallet Balance Top-Up
    """
    amount = request.data.get('amount')
    phone_number = request.data.get('phone_number') or request.data.get('phone') or request.data.get('from')
    task_id = request.data.get('task_id')
    bid_id = request.data.get('bid_id')
    purpose = request.data.get('purpose') or ('escrow_deposit' if task_id else 'wallet_topup')
    description = request.data.get('description') or f"Boulot Man {purpose.replace('_', ' ').title()}"

    if not amount or not phone_number:
        return Response(
            {"error": "Both 'amount' and 'phone_number' are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    from decimal import Decimal
    try:
        amount_dec = Decimal(str(amount))
        if amount_dec <= 0:
            raise ValueError()
    except Exception:
        return Response({"error": "Invalid amount specified."}, status=status.HTTP_400_BAD_REQUEST)

    task_obj = None
    if task_id:
        from apps.tasks.models import Task
        try:
            task_obj = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    ext_ref = f"bm_{request.user.id}_{purpose}_{task_id or 'topup'}"
    collect_res = campay_collect(
        amount=amount_dec,
        phone_number=phone_number,
        description=description,
        external_reference=ext_ref
    )

    if not collect_res.get("success"):
        return Response(
            {"error": "Failed to initiate Mobile Money request.", "details": collect_res.get("error")},
            status=status.HTTP_400_BAD_REQUEST
        )

    campay_ref = collect_res.get("reference")
    wallet, _ = Wallet.objects.get_or_create(user=request.user)

    # Record pending transaction
    tx_category = 'escrow_hold' if purpose == 'escrow_deposit' else 'earnings'
    Transaction.objects.create(
        wallet=wallet,
        amount=amount_dec,
        type='pending',
        category=tx_category,
        reference=task_obj,
        description=f"CamPay MoMo payment pending ({campay_ref})",
        status='pending',
        metadata={
            'campay_reference': campay_ref,
            'phone_number': format_cameroon_phone(phone_number),
            'purpose': purpose,
            'task_id': task_id,
            'bid_id': bid_id,
            'ussd_code': collect_res.get('ussd_code'),
            'operator': collect_res.get('operator'),
        }
    )

    create_audit_log(
        actor=request.user,
        action="campay_payment_initiated",
        entity_type="wallet",
        entity_id=wallet.id,
        summary=f"Initiated {amount_dec} XAF via CamPay ({phone_number})",
        metadata={"campay_reference": campay_ref, "purpose": purpose},
        ip_address=request.META.get("REMOTE_ADDR"),
    )

    return Response({
        "success": True,
        "reference": campay_ref,
        "ussd_code": collect_res.get("ussd_code"),
        "operator": collect_res.get("operator"),
        "amount": str(amount_dec),
        "currency": "XAF",
        "message": "Payment prompt sent to your phone. Please approve the USSD prompt with your Mobile Money PIN.",
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campay_check_status_view(request, reference):
    """
    Checks the status of a CamPay transaction.
    If SUCCESSFUL, completes escrow deposit or wallet top-up atomically.
    """
    res = campay_check_transaction(reference)
    if not res.get("success"):
        return Response(
            {"error": "Failed to query CamPay status", "details": res.get("error")},
            status=status.HTTP_400_BAD_REQUEST
        )

    tx_status = (res.get("status") or "").upper()
    
    # Check if transaction in DB needs status transition
    tx = Transaction.objects.filter(metadata__campay_reference=reference).first()
    if tx and tx.status == 'pending' and tx_status == 'SUCCESSFUL':
        _process_successful_campay_payment(tx, res)

    return Response({
        "success": True,
        "reference": reference,
        "status": tx_status,
        "amount": res.get("amount"),
        "currency": res.get("currency"),
        "operator": res.get("operator"),
        "is_completed": tx_status == "SUCCESSFUL",
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def campay_webhook_view(request):
    """
    Webhook endpoint to receive real-time status updates from CamPay.
    """
    campay_ref = request.data.get('reference') or request.data.get('ref')
    if not campay_ref:
        return Response({"status": "ignored", "reason": "no reference"}, status=status.HTTP_200_OK)

    res = campay_check_transaction(campay_ref)
    if res.get("success") and (res.get("status") or "").upper() == "SUCCESSFUL":
        tx = Transaction.objects.filter(metadata__campay_reference=campay_ref).first()
        if tx and tx.status == 'pending':
            _process_successful_campay_payment(tx, res)

    return Response({"status": "ok"}, status=status.HTTP_200_OK)


def _process_successful_campay_payment(tx, campay_res):
    """
    Internal helper to atomically finalize an approved CamPay payment.
    """
    wallet = tx.wallet
    meta = tx.metadata or {}
    purpose = meta.get('purpose', 'escrow_deposit')
    amount = tx.amount

    with db_transaction.atomic():
        tx.status = 'completed'
        tx.save(update_fields=['status'])

        if purpose == 'escrow_deposit':
            wallet.pending_escrow += amount
            wallet.save(update_fields=['pending_escrow', 'updated_at'])

            task_id = meta.get('task_id')
            bid_id = meta.get('bid_id')
            if task_id:
                from apps.tasks.models import Task, Bid
                from django.utils import timezone
                try:
                    task = Task.objects.get(id=task_id)
                    if bid_id:
                        bid = Bid.objects.get(id=bid_id)
                        bid.status = 'accepted'
                        bid.accepted_at = timezone.now()
                        bid.save(update_fields=['status', 'accepted_at'])
                        task.assigned_to = bid.technician

                    task.status = 'in_progress'
                    task.save(update_fields=['status', 'assigned_to'])

                    if task.assigned_to:
                        create_notification(
                            user=task.assigned_to,
                            category="payment",
                            title=f"Escrow Funded for {task.title}",
                            body=f"Client paid {amount} XAF via Mobile Money. You can now start the work.",
                            link=f"/dashboard/technician/tasks/{task.id}",
                            metadata={"task_id": task.id, "amount": str(amount)},
                        )
                    create_notification(
                        user=wallet.user,
                        category="payment",
                        title=f"Escrow Payment Successful",
                        body=f"{amount} XAF is securely locked in Boulot Man Escrow for '{task.title}'.",
                        link=f"/dashboard/client/tasks/{task.id}",
                        metadata={"task_id": task.id, "amount": str(amount)},
                    )
                except Exception as ex:
                    logger.error(f"Error finalizing task escrow for task_id {task_id}: {ex}")

        elif purpose == 'wallet_topup':
            wallet.available_balance += amount
            wallet.save(update_fields=['available_balance', 'updated_at'])
            create_notification(
                user=wallet.user,
                category="payment",
                title="Wallet Top-Up Successful",
                body=f"Your wallet balance was credited with {amount} XAF via Mobile Money.",
                link="/dashboard/technician/wallet",
                metadata={"amount": str(amount)},
            )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def campay_withdraw_view(request):
    """
    Instant Mobile Money withdrawal for Technicians and Companies.
    """
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    amount = request.data.get('amount')
    phone_number = request.data.get('phone_number') or request.data.get('phone') or request.data.get('to')
    description = request.data.get('description') or f"Boulot Man Payout to {request.user.get_full_name() or request.user.username}"

    if not amount or not phone_number:
        return Response(
            {"error": "Both 'amount' and 'phone_number' are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    from decimal import Decimal
    try:
        amount_dec = Decimal(str(amount))
        if amount_dec <= 0:
            raise ValueError()
    except Exception:
        return Response({"error": "Invalid withdrawal amount specified."}, status=status.HTTP_400_BAD_REQUEST)

    if not wallet.can_withdraw(amount_dec):
        return Response(
            {"error": f"Insufficient wallet balance. You have {wallet.available_balance} {wallet.currency} available."},
            status=status.HTTP_400_BAD_REQUEST
        )

    ext_ref = f"bm_withdraw_{request.user.id}_{int(amount_dec)}"
    withdraw_res = campay_withdraw(
        amount=amount_dec,
        phone_number=phone_number,
        description=description,
        external_reference=ext_ref
    )

    if not withdraw_res.get("success"):
        return Response(
            {"error": "CamPay payout initiation failed.", "details": withdraw_res.get("error")},
            status=status.HTTP_400_BAD_REQUEST
        )

    campay_ref = withdraw_res.get("reference")

    with db_transaction.atomic():
        wallet.available_balance -= amount_dec
        wallet.total_withdrawn += amount_dec
        wallet.save(update_fields=['available_balance', 'total_withdrawn', 'updated_at'])

        Transaction.objects.create(
            wallet=wallet,
            amount=amount_dec,
            type='debit',
            category='withdrawal',
            description=f"Mobile Money withdrawal to {format_cameroon_phone(phone_number)} ({campay_ref})",
            status='completed',
            metadata={
                'campay_reference': campay_ref,
                'phone_number': format_cameroon_phone(phone_number),
                'payout_method': 'CamPay Mobile Money',
            }
        )

        create_audit_log(
            actor=request.user,
            action="campay_withdrawal_completed",
            entity_type="wallet",
            entity_id=wallet.id,
            summary=f"Withdrew {amount_dec} XAF to {phone_number}",
            metadata={"amount": str(amount_dec), "campay_reference": campay_ref},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        create_notification(
            user=request.user,
            category="payment",
            title="Mobile Money Withdrawal Sent",
            body=f"{amount_dec} XAF has been disbursed to your Mobile Money account ({phone_number}).",
            link="/dashboard/technician/wallet",
            metadata={"amount": str(amount_dec), "campay_reference": campay_ref},
        )

    return Response({
        "success": True,
        "message": f"Successfully disbursed {amount_dec} XAF to {phone_number}.",
        "reference": campay_ref,
        "available_balance": str(wallet.available_balance),
        "currency": wallet.currency,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campay_balance_view(request):
    """
    Returns live CamPay platform balance.
    """
    res = campay_get_balance()
    if not res.get("success"):
        return Response({"error": "Failed to fetch CamPay balance", "details": res.get("error")}, status=status.HTTP_400_BAD_REQUEST)
    return Response(res.get("data", {}))


