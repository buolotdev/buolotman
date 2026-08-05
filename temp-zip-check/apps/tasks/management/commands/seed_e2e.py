from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.tasks.models import Task, Bid, Milestone, Category, Skill
from apps.messaging.models import Conversation, Message

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds E2E test data for dashboards'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting E2E Testing of Dashboards Flow...")
        
        # 1. Create or get test users
        client, _ = User.objects.get_or_create(email="testclient@example.com", defaults={
            "username": "testclient", "first_name": "John", "last_name": "Client", "role": "client", "is_active": True
        })
        if not client.check_password("testpass123"):
            client.set_password("testpass123")
            client.save()
            
        tech, _ = User.objects.get_or_create(email="testtech@example.com", defaults={
            "username": "testtech", "first_name": "Tech", "last_name": "Pro", "role": "technician", "is_active": True
        })
        if not tech.check_password("testpass123"):
            tech.set_password("testpass123")
            tech.save()
        self.stdout.write(f"[OK] Created/Fetched Users: {client.email} (Client) and {tech.email} (Technician)")

        # 2. Setup Category & Skill
        cat, _ = Category.objects.get_or_create(name="Home Repair")
        sub, _ = Skill.objects.get_or_create(name="Plumbing")
        self.stdout.write(f"[OK] Setup Category '{cat.name}' and Skill '{sub.name}'")

        # 3. Client posts a Task
        task, created = Task.objects.get_or_create(
            title="Fix Kitchen Sink Leak",
            client=client,
            defaults={
                "description": "The pipe under the sink is leaking badly.",
                "budget_min": 10000,
                "budget_max": 25000,
                "status": "open",
                "category": cat
            }
        )
        if created:
            task.skills.add(sub)
        self.stdout.write(f"[OK] Client posted Task: '{task.title}' with ID {task.id}")

        # 4. Technician places a Bid
        bid, created = Bid.objects.get_or_create(
            task=task,
            technician=tech,
            defaults={
                "amount": 15000,
                "message": "I am a professional plumber, I can fix this today.",
                "status": "pending"
            }
        )
        self.stdout.write(f"[OK] Technician bid {bid.amount} on Task (Bid ID {bid.id})")

        # 5. Client accepts Bid
        bid.status = "accepted"
        bid.save()
        task.status = "in_progress"
        task.technician = tech
        task.save()
        self.stdout.write(f"[OK] Client accepted Bid! Task is now '{task.status}'")

        # 6. Generate Milestones automatically for the accepted Task
        if not task.milestones.exists():
            Milestone.objects.create(task=task, title="Inspection", amount=5000, status="Pending")
            Milestone.objects.create(task=task, title="Repair & Parts", amount=10000, status="Pending")
            self.stdout.write("[OK] Generated Milestones for the Task")

        # 7. Create a Conversation between them
        conv, created = Conversation.objects.get_or_create(task=task)
        if created:
            conv.participants.add(client, tech)
            Message.objects.create(conversation=conv, sender=client, text="Hello! When can you arrive?")
            Message.objects.create(conversation=conv, sender=tech, text="I will be there in 30 minutes.")
            self.stdout.write("[OK] Generated Chat Conversation & Messages")
        
        self.stdout.write("\n--- TEST COMPLETED SUCCESSFULLY ---")
        self.stdout.write("You can now login with:")
        self.stdout.write("Client: testclient@example.com / testpass123")
        self.stdout.write("Technician: testtech@example.com / testpass123")
        self.stdout.write("And you will see this live project, bid, and chat in their dashboards!")
