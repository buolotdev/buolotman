import os
import django
import sys
# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()
from apps.tasks.models import Category, Skill
# Categories and their skills
data = {
    "Electrical": ["Panel Installation", "Wiring", "Lighting", "Troubleshooting"],
    "Plumbing": ["Pipe Leak", "Water Heater", "Drain Cleaning", "Fixture Installation"],
    "Carpentry": ["Furniture Assembly", "Cabinet Installation", "Door Repair", "Deck Building"],
    "Cleaning": ["House Cleaning", "Deep Cleaning", "Move In/Out Cleaning", "Office Cleaning"],
    "IT Support": ["Network Setup", "Virus Removal", "Hardware Repair", "Software Installation"],
}
for cat_name, skills in data.items():
    cat, created = Category.objects.get_or_create(name=cat_name, slug=cat_name.lower().replace(" ", "-"))
    for skill_name in skills:
        Skill.objects.get_or_create(category=cat, name=skill_name, slug=skill_name.lower().replace(" ", "-").replace("/", "-"))
print("Categories and Skills seeded successfully!")
