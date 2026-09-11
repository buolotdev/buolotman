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
    name: "Engineering & Technology Services",
    slug: "engineering-technology-services",
    icon: "https://img.icons8.com/fluency/96/source-code.png",
    skills: [
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
    id: 2,
    name: "Electrical & Power Engineering",
    slug: "electrical-power-engineering",
    icon: "https://img.icons8.com/fluency/96/electricity.png",
    skills: [
      "Residential & commercial wiring",
      "Solar inverter & battery installation",
      "Circuit breaker & panel installation",
      "Generator maintenance & repair",
      "Industrial electrical troubleshooting",
      "Power surge protection",
      "Lighting & LED design",
      "High-voltage transformer maintenance",
      "Appliance repair & diagnostics",
      "Energy audit & load balancing"
    ]
  },
  {
    id: 3,
    name: "Plumbing & Water Systems",
    slug: "plumbing-water-systems",
    icon: "https://img.icons8.com/fluency/96/plumbing.png",
    skills: [
      "Pipe leak repair & diagnostic",
      "Water heater installation & repair",
      "Drain cleaning & unclogging",
      "Borehole drilling & pump setup",
      "Water filtration & treatment",
      "Bathroom & kitchen fixtures",
      "Septic tank installation & pumping",
      "Sewer line inspection & repair",
      "Irrigation system installation",
      "Gas pipe installation & safety check"
    ]
  },
  {
    id: 4,
    name: "Construction, Masonry & Carpentry",
    slug: "construction-masonry-carpentry",
    icon: "https://img.icons8.com/fluency/96/hammer.png",
    skills: [
      "Masonry & bricklaying",
      "Custom carpentry & woodwork",
      "Roofing installation & leak repair",
      "Tile & marble flooring",
      "Painting & wall decorating",
      "Plastering & drywall finishing",
      "Welding & metal fabrication",
      "Paving & landscape construction",
      "Door & window framing",
      "Architectural drafting & remodeling"
    ]
  },
  {
    id: 5,
    name: "IT Infrastructure & Networking",
    slug: "it-infrastructure-networking",
    icon: "https://img.icons8.com/fluency/96/network.png",
    skills: [
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
    id: 6,
    name: "Cybersecurity Services",
    slug: "cybersecurity-services",
    icon: "https://img.icons8.com/fluency/96/security-checked.png",
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
    id: 7,
    name: "HVAC & Refrigeration",
    slug: "hvac-refrigeration",
    icon: "https://img.icons8.com/fluency/96/air-conditioner.png",
    skills: [
      "Air conditioner installation",
      "AC gas refilling & leak repair",
      "Commercial refrigeration setup",
      "Cold room maintenance",
      "Duct cleaning & airflow balancing",
      "Thermostat installation & calibration",
      "Chiller system overhaul",
      "Heat pump installation & service",
      "Ventilation & exhaust fan setup",
      "Preventative HVAC maintenance"
    ]
  },
  {
    id: 8,
    name: "Automotive & Heavy Machinery",
    slug: "automotive-heavy-machinery",
    icon: "https://img.icons8.com/fluency/96/car.png",
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
    id: 9,
    name: "Renewable Energy & Solar",
    slug: "renewable-energy-solar",
    icon: "https://img.icons8.com/fluency/96/solar-panel.png",
    skills: [
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
    id: 10,
    name: "CCTV & Security Systems",
    slug: "cctv-security-systems",
    icon: "https://img.icons8.com/fluency/96/security-camera.png",
    skills: [
      "CCTV camera installation & NVR config",
      "Electric fence installation",
      "Biometric access control systems",
      "Burglar & fire alarm setup",
      "Automatic gate motor installation",
      "Intercom & video doorbell setup",
      "Motion detector installation",
      "Smart home automation",
      "Perimeter security beam setup",
      "Security system maintenance & repair"
    ]
  },
  {
    id: 11,
    name: "Health & Beauty Technicians",
    slug: "health-beauty-technicians",
    icon: "https://img.icons8.com/fluency/96/spa-flower.png",
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
    id: 12,
    name: "Education & Learning",
    slug: "education-learning",
    icon: "https://img.icons8.com/fluency/96/graduation-cap.png",
    skills: [
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
    id: 13,
    name: "Other Technical & Labor Services",
    slug: "other-technical-labor-services",
    icon: "https://img.icons8.com/fluency/96/services.png",
    skills: [
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
];

export function mergeWithMasterCategories(apiCategories: any[] | null | undefined): Array<{
  id: number | string;
  name: string;
  slug: string;
  icon?: string;
  subcategories?: any[];
  skills?: string[];
}> {
  // 1. Build a master map starting with all 13 master categories
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

