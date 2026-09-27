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

export const MASTER_CATEGORY_PATTERNS: Record<string, RegExp> = {
  "software-and-digital-engineering": /\b(software|développ|develop|web|mobile|android|ios|frontend|backend|api|react|nextjs|python|javascript|typescript|fullstack|ui\s*\/\s*ux|figma|database|e-commerce|ecommerce|wordpress|cms|sql|django|flask|node|programmer|informatique)\b/i,
  "it-infrastructure-and-networking": /\b(network|réseau|reseau|cabling|câblage|cablage|serveur|server|hardware|matériel|materiel|lan|wan|active directory|virtualization|vmware|cisco|switch|routeur|router|it support|helpdesk|backup|storage)\b/i,
  "cybersecurity-services": /\b(cyber|sécurité|securite|penetration|pentest|audit|hacking|forensic|gdpr|rgpd|hipaa|vulnerability|cryptograph|encryption|iam|firewall|malware|antivirus|soc|siem|infosec)\b/i,
  "cloud-and-systems-engineering": /\b(cloud|aws|azure|gcp|devops|ci\s*\/\s*cd|docker|kubernetes|k8s|terraform|infrastructure as code|microservice|cluster|replication|prometheus|grafana|helm|ansible)\b/i,
  "electrical-and-electronics-engineering": /\b(electr|électric|electric|câblage|cablage|wiring|circuit|breaker|disjoncteur|tableau|generator|générateur|generateur|groupe électrogène|groupe electrogene|surge|lighting|éclairage|eclairage|transformer|transformateur|appliance|electromenag|électroménag|pcb|carte électronique|carte electronique|domotique|courant fort|courant faible)\b/i,
  "civil-construction-and-architecture": /\b(civil|bâtiment|batiment|construction|architect|maçon|macon|masonry|carpentr|menuiserie|wood|bois|roof|toiture|tile|carrelage|marble|marbre|peint|paint|plaster|plâtre|platre|weld|soudure|fabrication|paving|structural|bepc|bac|génie civil|genie civil|chantier|charpente)\b/i,
  "mechanical-and-industrial-engineering": /\b(mechanic|mécanique|mecanique|hvac|climat|air condition|refrigerat|froid|industrial|industriel|machiner|plumb|plomberie|pump|pompe|hydraulic|hydraulique|pneumatic|pneumatique|boiler|chaudière|chaudiere|cold room|chambre froide|cnc|tourneur|tuyauterie)\b/i,
  "renewable-energy-and-utilities": /\b(renew|renouvelable|solar|solaire|photovoltaic|photovoltaïque|inverter|onduleur|battery|batterie|wind|éolien|eolien|smart grid|energy audit|hydroelectric|hydroélectrique|geothermal|ev charg|borne de recharge|panneau solaire)\b/i,
  "automotive-and-heavy-equipment": /\b(auto|automobile|car |véhicule|vehicule|engine|moteur|brake|frein|suspension|transmission|diesel|heavy equipment|engin lourd|truck|camion|pneu|tire|bodywork|carrosserie|vidange|mécanique auto|mecanique auto)\b/i,
  "telecom-broadcast-and-security-systems": /\b(telecom|télécom|cctv|caméra|camera|surveillance|electric fence|clôture électrique|cloture electrique|biometric|biométrie|biometrie|alarm|alarme|intercom|fiber|fibre|optique|antenn|smart home|radio communication|contrôle d'accès|controle d'acces)\b/i,
  "handyman-and-home-maintenance": /\b(handyman|bricolage|home repair|réparation|furniture|meuble|assembly|montage|door lock|serrure|serrurier|curtain|rideau|tap|robinet|switch|interrupteur|pressure wash|patching|dépannage maison)\b/i,
  "cleaning-outdoor-and-environmental-services": /\b(clean|nettoyage|fumigation|pest|dératisation|deratisation|désinfection|desinfection|lawn|pelouse|garden|jardin|landscape|paysag|septic|fosse|sanitation|vidange|water tank|carpet|tapis|vitre|waste|déchet|dechet|tree|arbre|pool|piscine|ménage|menage)\b/i,
  "transport-logistics-and-support-services": /\b(transport|logist|delivery|livraison|dispatch|déménagement|demenagement|relocation|moving|truck|cargo|fret|courier|courrier|parcel|colis|fleet|flotte|warehouse|entrepôt|entrepot|chauffeur|driver|rental|location voiture|coursier)\b/i,
  "health-beauty-and-personal-care": /\b(health|santé|sante|beauty|beauté|beaute|care|soin|massage|hair|coiffur|nail|manucure|pédicure|pedicure|makeup|maquillage|skin|dermatolog|fitness|coach|nutrition|acupuncture|barber|barbier|esthétique|esthetique)\b/i,
  "education-language-and-document-services": /\b(educat|cours|tutor|soutien|scolaire|math|physic|science|language|langue|english|anglais|french|français|francais|music|musique|exam|traduction|translation|interpret|document|rédaction|redaction|curriculum|professeur|enseignant)\b/i
};

const STOP_WORDS = new Set([
  "and", "the", "for", "with", "all", "services", "service", "engineering",
  "systems", "system", "management", "development", "general", "support",
  "independent", "registered", "certified", "specialist", "technician", "company", "enterprise"
]);

export function isCategoryMatch(item: any, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === "any" || selectedCategory === "all") {
    return true;
  }

  const rawTarget = String(selectedCategory).trim().toLowerCase();
  const targetSlug = rawTarget.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  // Find matching master category
  const master = MASTER_CATEGORIES.find(
    (m) => m.slug === targetSlug || m.slug === rawTarget || m.name.toLowerCase() === rawTarget
  );

  // Extract searchable strings from item
  const itemCategory = String(item.category || item.category_name || item.service_category || "").toLowerCase();
  const itemRole = String(item.role || item.profession || item.tagline || "").toLowerCase();
  const itemBio = String(item.description || item.about || item.bio || "").toLowerCase();

  const skillsArr: string[] = Array.isArray(item.skills)
    ? item.skills.map((s: any) => (typeof s === "string" ? s : s?.name || "")).filter(Boolean)
    : [];
  const servicesArr: string[] = Array.isArray(item.services)
    ? item.services.map((s: any) => (typeof s === "string" ? s : s?.title || s?.name || "")).filter(Boolean)
    : [];

  const itemSkillsStr = skillsArr.join(" ").toLowerCase();
  const itemServicesStr = servicesArr.join(" ").toLowerCase();

  // Combine primary identifier text (high confidence)
  const primaryText = `${itemCategory} ${itemRole} ${itemSkillsStr} ${itemServicesStr}`.toLowerCase();

  if (master) {
    // 1. Direct category match
    if (itemCategory.includes(master.name.toLowerCase()) || itemCategory.includes(master.slug)) {
      return true;
    }

    // 2. Exact match against master skills
    for (const skill of master.skills) {
      const sLow = skill.toLowerCase();
      if (primaryText.includes(sLow)) return true;
      for (const itemSkill of skillsArr) {
        if (sLow.includes(itemSkill.toLowerCase()) || itemSkill.toLowerCase().includes(sLow)) return true;
      }
      for (const itemSrv of servicesArr) {
        if (sLow.includes(itemSrv.toLowerCase()) || itemSrv.toLowerCase().includes(sLow)) return true;
      }
    }

    // 3. Domain pattern regex match on primaryText
    const pattern = MASTER_CATEGORY_PATTERNS[master.slug];
    if (pattern && (pattern.test(primaryText) || pattern.test(itemCategory) || pattern.test(itemRole))) {
      return true;
    }

    // 4. If primary text didn't match, check bio only with strict pattern test (excluding generic mentions)
    if (pattern && pattern.test(itemBio)) {
      return true;
    }

    return false;
  }

  // Non-master / custom category fallback
  const nonStopTokens = rawTarget
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (nonStopTokens.length === 0) {
    return primaryText.includes(rawTarget);
  }

  return nonStopTokens.some((tok) => primaryText.includes(tok));
}


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


