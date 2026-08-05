import json
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.tasks.models import Category, Skill

class Command(BaseCommand):
    help = 'Seeds the database with professional categories and skills based on the platform spec.'

    def handle(self, *args, **options):
        # The exact categories and skills based on the platform's new taxonomy
        DATA = [
            {
                "category": "Engineering & Technology Services",
                "skills": [
                    "Web application development",
                    "Mobile application development (Android / iOS)",
                    "Backend systems & API development",
                    "DevOps & cloud deployment",
                    "Database design & optimization",
                    "ERP & CRM system implementation",
                    "Software maintenance & upgrades",
                    "UI/UX design engineering",
                    "QA testing & automation",
                    "Legacy system modernization"
                ]
            },
            {
                "category": "IT Infrastructure & Networking",
                "skills": [
                    "Network setup & configuration",
                    "Server administration & OS config",
                    "Cloud infrastructure design",
                    "Hardware installation & repair",
                    "System backup & data recovery",
                    "IT support & troubleshooting",
                    "Virtualization & VM management",
                    "Local Area Network (LAN) optimization",
                    "Wide Area Network (WAN) routing",
                    "Active Directory setup"
                ]
            },
            {
                "category": "Cybersecurity Services",
                "skills": [
                    "Penetration testing & ethical hacking",
                    "Security auditing & risk analysis",
                    "Incident response & forensics",
                    "Compliance consulting (GDPR/HIPAA)",
                    "Vulnerability assessment",
                    "Data encryption & cryptography",
                    "Identity & Access Management (IAM)",
                    "Endpoint security protection",
                    "Firewall & IDS/IPS setup",
                    "Malware analysis & removal"
                ]
            },
            {
                "category": "Cloud & Systems Engineering",
                "skills": [
                    "AWS architecture & deployment",
                    "Azure solutions & scaling",
                    "Google Cloud deployment",
                    "Kubernetes & Docker containerization",
                    "Microservices architecture",
                    "Cloud cost optimization",
                    "Serverless computing (Lambda)",
                    "Infrastructure as Code (Terraform)",
                    "CI/CD pipeline automation",
                    "Disaster recovery planning"
                ]
            },
            {
                "category": "Electrical & Electronics Engineering",
                "skills": [
                    "Circuit design & simulation",
                    "PCB layout & prototyping",
                    "IoT device development",
                    "Embedded systems programming",
                    "Electrical wiring analysis",
                    "Automation & control systems",
                    "Power distribution systems",
                    "Microcontroller programming (Arduino/Raspberry Pi)",
                    "Signal processing",
                    "Renewable energy electronics"
                ]
            },
            {
                "category": "Mechanical, Civil & Industrial",
                "skills": [
                    "CAD 3D modeling (AutoCAD/SolidWorks)",
                    "Structural analysis & FEA",
                    "HVAC engineering & design",
                    "Manufacturing process optimization",
                    "Materials testing & selection",
                    "Architecture drafting & blueprints",
                    "Fluid dynamics analysis",
                    "Supply chain logistics engineering",
                    "Robotics mechanical design",
                    "Thermodynamics consulting"
                ]
            },
            {
                "category": "Renewable Energy & Utilities",
                "skills": [
                    "Solar panel system planning",
                    "Wind turbine engineering",
                    "Smart grid design & implementation",
                    "Energy audits & efficiency",
                    "Battery storage solutions",
                    "Utility mapping & surveying",
                    "Hydroelectric systems analysis",
                    "Geothermal system design",
                    "Biomass energy consulting",
                    "EV charging station installation"
                ]
            },
            {
                "category": "Specialized Technical Services",
                "skills": [
                    "Drone surveying & mapping",
                    "Robotics programming (ROS)",
                    "Acoustic engineering & soundproofing",
                    "Biomedical equipment repair",
                    "3D printing & rapid prototyping",
                    "Aerospace engineering consulting",
                    "Metallurgy & welding engineering",
                    "Chemical process engineering",
                    "Optics & laser engineering",
                    "Nanotechnology research"
                ]
            },
            {
                "category": "Telecom & Broadcast",
                "skills": [
                    "Fiber optic splicing & testing",
                    "Satellite installation & alignment",
                    "RF engineering & antenna design",
                    "Broadband network setup",
                    "Studio acoustics & broadcasting",
                    "VoIP system configuration",
                    "5G network deployment",
                    "Microwave link engineering",
                    "Telecom tower maintenance",
                    "Audio/Visual system integration"
                ]
            },
            {
                "category": "Handyman Services",
                "skills": [
                    "Carpentry & Custom woodwork",
                    "Furniture assembly & repair",
                    "Plumbing pipe & leak repairs",
                    "Home electrical tasks & lighting",
                    "Painting & Decorating (Interior/Exterior)",
                    "General property maintenance",
                    "Appliance installation & repair",
                    "Drywall patching & texturing",
                    "Tile & flooring installation",
                    "Window & door installation"
                ]
            },
            {
                "category": "Health & Beauty Technicians",
                "skills": [
                    "Massage therapy & physical relaxation",
                    "Hair styling, cutting & coloring",
                    "Nail care (Manicure/Pedicure)",
                    "Makeup artistry for events",
                    "Skincare treatments & facials",
                    "Laser hair removal & dermatology",
                    "Personal training & fitness instruction",
                    "Nutrition planning & consulting",
                    "Acupuncture & holistic therapy",
                    "Barbering & men's grooming"
                ]
            },
            {
                "category": "Education & Learning",
                "skills": [
                    "Math & Science tutoring",
                    "Language instruction (English, French, etc.)",
                    "Music & Instrument lessons",
                    "Standardized test preparation",
                    "Coding & Computer Science instruction",
                    "Special education & learning support",
                    "Business & Finance tutoring",
                    "Art & Design instruction",
                    "Life coaching & mentoring",
                    "Curriculum development"
                ]
            },
            {
                "category": "Other",
                "skills": [
                    "General Labor Task",
                    "Specialized Technical Labor",
                    "Consultation Services",
                    "Delivery & Courier Services",
                    "Custom Project Request",
                    "Event Planning & Management",
                    "Photography & Videography",
                    "Legal & Paralegal Services",
                    "Accounting & Tax Services",
                    "Virtual Assistant Services"
                ]
            }
        ]

        self.stdout.write(self.style.WARNING("Clearing existing categories and skills..."))
        Skill.objects.all().delete()
        Category.objects.all().delete()

        self.stdout.write("Populating categories and skills...")
        
        for idx, item in enumerate(DATA):
            cat_name = item["category"]
            cat_slug = slugify(cat_name)
            
            # Ensure slug is unique, though they should be unique in this list
            if Category.objects.filter(slug=cat_slug).exists():
                cat_slug = f"{cat_slug}-{idx}"

            cat = Category.objects.create(
                name=cat_name,
                slug=cat_slug,
                order=idx,
                is_active=True
            )
            
            for skill_name in item["skills"]:
                skill_slug = slugify(f"{cat_name}-{skill_name}")
                if Skill.objects.filter(slug=skill_slug).exists():
                    # Extremely unlikely but just in case
                    import uuid
                    skill_slug = f"{skill_slug}-{str(uuid.uuid4())[:4]}"
                    
                Skill.objects.create(
                    name=skill_name,
                    slug=skill_slug,
                    category=cat
                )

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(DATA)} categories with 10 subcategories each!"))
