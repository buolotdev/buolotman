export interface MasterCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  skills: string[];
}

export const MASTER_CATEGORIES: MasterCategory[] = [
  {
    id: 1,
    name: "Software & Digital Engineering",
    slug: "software-and-digital-engineering",
    icon: "https://img.icons8.com/fluency/96/source-code.png",
    skills: [
      "Web application development",
      "Mobile application development (Android / iOS)",
      "Backend systems & API development",
      "UI/UX design engineering",
      "QA testing & automation",
      "E-commerce platform development",
      "WordPress & CMS development",
      "Database design & optimization",
      "Product prototyping & MVP development",
      "Legacy system modernization"
    ]
  },
  {
    id: 2,
    name: "IT Infrastructure & Networking",
    slug: "it-infrastructure-and-networking",
    icon: "https://img.icons8.com/fluency/96/network.png",
    skills: [
      "Network setup & configuration",
      "Server administration & OS config",
      "Hardware installation & repair",
      "System backup & data recovery",
      "IT support & troubleshooting",
      "Virtualization & VM management",
      "Local Area Network (LAN) optimization",
      "Wide Area Network (WAN) routing",
      "Active Directory setup",
      "Structured cabling"
    ]
  },
  {
    id: 3,
    name: "Cybersecurity Services",
    slug: "cybersecurity-services",
    icon: "https://img.icons8.com/fluency/96/cyber-security.png",
    skills: [
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
    id: 4,
    name: "Cloud & Systems Engineering",
    slug: "cloud-and-systems-engineering",
    icon: "https://img.icons8.com/fluency/96/cloud.png",
    skills: [
      "AWS & Cloud architecture",
      "DevOps & CI/CD pipelines",
      "Docker & Kubernetes orchestration",
      "Database clustering & replication",
      "High availability systems",
      "Cloud migration & optimization",
      "Monitoring & logging (Prometheus/ELK)",
      "Terraform & Infrastructure as Code",
      "Disaster recovery planning",
      "Microservices architecture"
    ]
  },
  {
    id: 5,
    name: "Electrical & Electronics Engineering",
    slug: "electrical-and-electronics-engineering",
    icon: "https://img.icons8.com/fluency/96/electrical.png",
    skills: [
      "Residential & commercial wiring",
      "Circuit breaker & panel installation",
      "Generator maintenance & repair",
      "Industrial electrical troubleshooting",
      "Power surge protection",
      "Lighting & LED design",
      "High-voltage transformer maintenance",
      "Appliance repair & diagnostics",
      "Energy audit & load balancing",
      "Electronic board & PCB repair"
    ]
  },
  {
    id: 6,
    name: "Civil, Construction & Architecture",
    slug: "civil-construction-and-architecture",
    icon: "https://img.icons8.com/fluency/96/engineering.png",
    skills: [
      "Masonry & bricklaying",
      "Custom carpentry & woodwork",
      "Roofing installation & leak repair",
      "Tile & marble flooring",
      "Painting & wall decorating",
      "Plastering & drywall finishing",
      "Welding & metal fabrication",
      "Paving & landscape construction",
      "Architectural drafting & remodeling",
      "Structural engineering inspection"
    ]
  },
  {
    id: 7,
    name: "Mechanical & Industrial Engineering",
    slug: "mechanical-and-industrial-engineering",
    icon: "https://img.icons8.com/fluency/96/gears.png",
    skills: [
      "HVAC & air conditioner installation",
      "Commercial refrigeration setup",
      "Industrial machinery maintenance",
      "Plumbing networks & pump setup",
      "Hydraulic system diagnostics",
      "Pneumatic systems servicing",
      "Boiler & heating maintenance",
      "Conveyor belt maintenance",
      "Cold room repair",
      "CNC machining & metal turning"
    ]
  },
  {
    id: 8,
    name: "Renewable Energy & Utilities",
    slug: "renewable-energy-and-utilities",
    icon: "https://img.icons8.com/fluency/96/solar-panel.png",
    skills: [
      "Solar panel system planning",
      "Solar inverter & battery installation",
      "Wind turbine engineering",
      "Smart grid design & implementation",
      "Energy audits & efficiency",
      "Battery storage solutions",
      "Utility mapping & surveying",
      "Hydroelectric systems analysis",
      "Geothermal system design",
      "EV charging station installation"
    ]
  },
  {
    id: 9,
    name: "Automotive & Heavy Equipment",
    slug: "automotive-and-heavy-equipment",
    icon: "https://img.icons8.com/fluency/96/car-service.png",
    skills: [
      "Engine diagnostics & overhaul",
      "Auto electrical & wiring repair",
      "Brake & suspension repair",
      "Transmission repair & servicing",
      "Diesel generator & pump repair",
      "Heavy equipment hydraulics",
      "Air conditioning & coolant recharge",
      "Bodywork & spray painting",
      "Tire balancing & wheel alignment",
      "Fleet preventive maintenance"
    ]
  },
  {
    id: 10,
    name: "Telecom, Broadcast & Security Systems",
    slug: "telecom-broadcast-and-security-systems",
    icon: "https://img.icons8.com/fluency/96/radio-tower.png",
    skills: [
      "CCTV camera installation & NVR config",
      "Electric fence installation",
      "Biometric access control systems",
      "Burglar & fire alarm setup",
      "Automatic gate motor installation",
      "Intercom & video doorbell setup",
      "Fiber optics splicing & cabling",
      "Radio communication & antennas",
      "Smart home automation",
      "Security system maintenance & repair"
    ]
  },
  {
    id: 11,
    name: "Handyman & Home Maintenance",
    slug: "handyman-and-home-maintenance",
    icon: "https://img.icons8.com/fluency/96/maintenance.png",
    skills: [
      "General home repairs",
      "Furniture assembly & repair",
      "Door lock & hardware installation",
      "Curtain rod & blind mounting",
      "Minor plumbing & tap fixes",
      "Minor electrical & switch replacement",
      "Pressure washing & surface cleaning",
      "Drywall patching & touch-up painting",
      "Appliance installation",
      "Gutter cleaning & repair"
    ]
  },
  {
    id: 12,
    name: "Cleaning, Outdoor & Environmental Services",
    slug: "cleaning-outdoor-and-environmental-services",
    icon: "https://img.icons8.com/fluency/96/broom.png",
    skills: [
      "Deep house & office cleaning",
      "Post-construction cleaning",
      "Fumigation & pest control",
      "Lawn mowing & garden landscaping",
      "Septic tank draining & sanitation",
      "Water tank cleaning & disinfection",
      "Carpet & upholstery steam cleaning",
      "Window & glass facade cleaning",
      "Waste disposal & recycling management",
      "Tree trimming & pool maintenance"
    ]
  },
  {
    id: 13,
    name: "Transport, Logistics & Support Services",
    slug: "transport-logistics-and-support-services",
    icon: "https://img.icons8.com/fluency/96/delivery.png",
    skills: [
      "Goods delivery & dispatch",
      "Relocation & house moving services",
      "Heavy cargo trucking",
      "Courier & parcel logistics",
      "Fleet management & tracking",
      "Warehouse loading & inventory",
      "Cold-chain transport",
      "Event transport logistics",
      "Vehicle rental with driver",
      "Airport pickup & protocol transport"
    ]
  },
  {
    id: 14,
    name: "Health, Beauty & Personal Care",
    slug: "health-beauty-and-personal-care",
    icon: "https://img.icons8.com/fluency/96/spa.png",
    skills: [
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
    id: 15,
    name: "Education, Language & Document Services",
    slug: "education-language-and-document-services",
    icon: "https://img.icons8.com/fluency/96/student-center.png",
    skills: [
      "Math & Science tutoring",
      "Language instruction (English, French, etc.)",
      "Music & Instrument lessons",
      "Standardized test preparation",
      "Coding & Computer Science instruction",
      "Translation & interpretation",
      "Document drafting & formatting",
      "Business & Finance tutoring",
      "Life coaching & mentoring",
      "Curriculum development"
    ]
  }
];

export function mergeWithMasterCategories(apiCategories: any[] | null | undefined): Array<{
  id: number | string;
  name: string;
  slug: string;
  icon: string;
  skills: string[];
  subcategories: any[];
}> {
  // 1. Build a master map starting with all 15 master categories
  const categoriesMap = new Map<string, {
    id: number | string;
    name: string;
    slug: string;
    icon: string;
    skills: string[];
    subcategories: any[];
  }>();

  for (const master of MASTER_CATEGORIES) {
    categoriesMap.set(master.slug, {
      id: master.id,
      name: master.name,
      slug: master.slug,
      icon: master.icon,
      skills: master.skills,
      subcategories: master.skills.map((s, idx) => ({
        id: `${master.id}-${idx}`,
        name: s,
        slug: s.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      }))
    });
  }

  // 2. If API categories exist, clean & merge them
  if (Array.isArray(apiCategories) && apiCategories.length > 0) {
    for (const apiCat of apiCategories) {
      const rawName = String(apiCat.name || apiCat.title || "").trim();
      const rawSlug = String(apiCat.slug || rawName).trim().toLowerCase();

      // Skip invalid / purely numeric categories like "12"
      if (!rawName || /^\d+$/.test(rawName) || rawName.length < 3) {
        continue;
      }

      // Check if it matches an existing master category
      const matched = MASTER_CATEGORIES.find(
        m => m.slug === rawSlug || m.name.toLowerCase() === rawName.toLowerCase()
      );

      if (matched) {
        const existing = categoriesMap.get(matched.slug)!;
        existing.id = apiCat.id ?? existing.id;
        if (apiCat.icon) existing.icon = apiCat.icon;
        if (Array.isArray(apiCat.subcategories) && apiCat.subcategories.length > 0) {
          existing.subcategories = apiCat.subcategories;
        }
      } else {
        // Additional custom category from backend
        categoriesMap.set(rawSlug, {
          id: apiCat.id ?? rawSlug,
          name: rawName,
          slug: rawSlug,
          icon: apiCat.icon || "https://img.icons8.com/fluency/96/services.png",
          skills: Array.isArray(apiCat.skills) ? apiCat.skills : [],
          subcategories: Array.isArray(apiCat.subcategories) ? apiCat.subcategories : []
        });
      }
    }
  }

  return Array.from(categoriesMap.values());
}
