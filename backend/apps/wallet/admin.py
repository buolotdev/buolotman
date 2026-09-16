from django.contrib import admin
from .models import Wallet, Transaction


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'available_balance', 'pending_escrow', 'total_earnings', 'total_withdrawn', 'currency')
    search_fields = ('user__email',)
    readonly_fields = ('total_earnings', 'total_withdrawn')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'wallet', 'amount', 'type', 'category', 'status', 'created_at')
    list_filter = ('type', 'category', 'status', 'created_at')
    search_fields = ('wallet__user__email', 'wallet__user__first_name', 'wallet__user__last_name', 'description')
    raw_id_fields = ('wallet', 'reference')
    readonly_fields = ('created_at',)
