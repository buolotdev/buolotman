// Helper to intelligently resolve profession title, category tag & bio for technicians/companies

const INVALID_TERMS = [
  "intermediate", "diploma", "degree", "bachelor", "master", "phd", "matric",
  "high school", "beginner", "novice", "expert", "junior", "senior", "entry level",
  "student", "unemployed", "active", "online", "technician", "technicien", "user",
  "client", "member", "service provider", "provider", "professional specialist",
  "specialist", "test", "demo", "asdf", "qwerty", "null", "undefined", "none"
];

export function isGarbageText(str: string): boolean {
  if (!str || typeof str !== "string") return true;
  const clean = str.trim().toLowerCase();
  if (clean.length < 3 || clean.length > 70) return true;
  if (INVALID_TERMS.includes(clean)) return true;

  // Check if contains non-alphanumeric junk or long repeated characters (e.g. "aaaaaaa")
  if (/(.)\1{4,}/.test(clean)) return true;

  // Check vowel to consonant ratio for random gibberish (e.g. "YUGFJIYHKJ", "hushbluhtr", "BBRIYQEGBKJBUIGJAAAAAAAAAAAAA")
  const letters = clean.replace(/[^a-z]/g, "");
  if (letters.length >= 6) {
    const vowels = (letters.match(/[aeiou]/g) || []).length;
    if (vowels === 0 || vowels / letters.length < 0.12 || vowels / letters.length > 0.85) {
      return true;
    }
  }

  return false;
}

export function resolveProfessionTitle(item: any, lang: string = "en"): string {
  if (!item) return lang === "fr" ? "Spécialiste Qualifié" : "Certified Specialist";

  // If company
  const isCompany = item.type === "company" || item.role?.toString().toLowerCase() === "company";
  if (isCompany) {
    if (item.category && item.category !== "General Contracting" && !isGarbageText(item.category)) {
      return item.category;
    }
    if (item.category_name && !isGarbageText(item.category_name)) return item.category_name;
    return lang === "fr" ? "Entreprise Agréée" : "Registered Enterprise";
  }

  // 1. PRIORITY: Check services offered posted by technician in their profile (e.g. "IT ENGINEER", "Plumbing Repair", "Certified Electrician")
  const services = item.services || item.profile?.services || item.technician_profile?.services || [];
  if (Array.isArray(services) && services.length > 0 && services[0]?.title) {
    const srvTitle = services[0].title.trim();
    if (!isGarbageText(srvTitle)) {
      if (srvTitle === srvTitle.toUpperCase() && srvTitle.length > 3) {
        return srvTitle.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      }
      return srvTitle;
    }
  }

  // 2. Check skills list (e.g. ["Plumber"], ["Electrician"], ["Welder"])
  const skills = item.skills || item.profile?.skills || item.technician_profile?.skills || [];
  if (Array.isArray(skills) && skills.length > 0) {
    const validSkill = skills.find((s: string) => !isGarbageText(s));
    if (validSkill) {
      return formatSkillToProfession(validSkill.trim(), lang);
    }
  }

  // 3. Check direct specific specialty / profession / headline
  const explicitRole = item.specialty || item.profession || item.headline || item.title;
  if (explicitRole && typeof explicitRole === "string" && !isGarbageText(explicitRole)) {
    return explicitRole.trim();
  }

  // 4. Check category / category_name (e.g. "Handyman & Home Maintenance" -> "Plumbing Technician" or "Handyman")
  const cat = item.category || item.category_name || item.service_category;
  if (cat && typeof cat === "string" && !isGarbageText(cat)) {
    return formatCategoryToProfession(cat.trim(), lang);
  }

  return lang === "fr" ? "Spécialiste Technique" : "Technical Specialist";
}

export function formatSkillToProfession(skill: string, lang: string = "en"): string {
  const s = skill.toLowerCase();
  if (s.includes("plumb")) return lang === "fr" ? "Technicien en Plomberie" : "Plumbing Technician";
  if (s.includes("electr") || s.includes("wiring")) return lang === "fr" ? "Électricien Certifié" : "Certified Electrician";
  if (s.includes("cctv") || s.includes("secur")) return lang === "fr" ? "Ingénieur Vidéosurveillance & Sécurité" : "CCTV & Security Engineer";
  if (s.includes("ui") || s.includes("ux") || s.includes("design")) return lang === "fr" ? "Designer UI/UX" : "UI/UX Designer";
  if (s.includes("phone") || s.includes("mobile repair")) return lang === "fr" ? "Technicien Réparation Téléphones" : "Phone Repair Technician";
  if (s.includes("hair") || s.includes("barber") || s.includes("beauty")) return lang === "fr" ? "Coiffeur / Styliste" : "Hair Stylist";
  if (s.includes("weld")) return lang === "fr" ? "Soudeur Qualifié" : "Certified Welder";
  if (s.includes("clean")) return lang === "fr" ? "Spécialiste du Nettoyage" : "Cleaning Specialist";
  if (s.includes("paint")) return lang === "fr" ? "Peintre en Bâtiment" : "Professional Painter";
  if (s.includes("carpent") || s.includes("wood")) return lang === "fr" ? "Menuisier Qualifié" : "Carpenter";
  if (s.includes("mason") || s.includes("brick")) return lang === "fr" ? "Maçon en Bâtiment" : "Mason / Builder";
  if (s.includes("mechanic") || s.includes("auto")) return lang === "fr" ? "Mécanicien Automobile" : "Auto Mechanic";
  if (s.includes("hvac") || s.includes("air cond") || s.includes("climat")) return lang === "fr" ? "Technicien CVC & Climatisation" : "HVAC Specialist";
  if (s.includes("soft") || s.includes("web") || s.includes("develop")) return lang === "fr" ? "Ingénieur Logiciel" : "Software Engineer";
  if (s.includes("backend")) return lang === "fr" ? "Ingénieur Backend" : "Backend Engineer";
  if (s.includes("network") || s.includes("it ") || s.includes("system") || s.includes("engineer")) return lang === "fr" ? "Ingénieur Réseaux & IT" : "IT & Network Engineer";
  if (s.includes("handy")) return lang === "fr" ? "Artisan Polyvalent" : "Handyman Specialist";

  return skill.charAt(0).toUpperCase() + skill.slice(1);
}

export function formatCategoryToProfession(category: string, lang: string = "en"): string {
  const c = category.toLowerCase();
  if (c.includes("handyman") || c.includes("home maintenance")) {
    return lang === "fr" ? "Technicien en Plomberie & Maintenance" : "Plumbing & Maintenance Pro";
  }
  if (c.includes("software") || c.includes("digital engineering")) {
    return lang === "fr" ? "Ingénieur Logiciel & Digital" : "Software & Digital Engineer";
  }
  if (c.includes("it infrastructure") || c.includes("networking")) {
    return lang === "fr" ? "Ingénieur Réseaux & IT" : "IT & Network Engineer";
  }
  if (c.includes("cybersecurity")) {
    return lang === "fr" ? "Expert en Cybersécurité" : "Cybersecurity Specialist";
  }
  if (c.includes("electrical") || c.includes("electronics")) {
    return lang === "fr" ? "Électricien Certifié" : "Certified Electrician";
  }
  if (c.includes("civil") || c.includes("construction") || c.includes("architecture")) {
    return lang === "fr" ? "Spécialiste BTP & Construction" : "Civil & Construction Specialist";
  }
  if (c.includes("mechanical") || c.includes("industrial")) {
    return lang === "fr" ? "Ingénieur Mécanique & Industriel" : "Mechanical Engineer";
  }
  if (c.includes("automotive") || c.includes("heavy equipment")) {
    return lang === "fr" ? "Technicien Automobile" : "Auto Mechanic";
  }
  if (c.includes("clean") || c.includes("environmental")) {
    return lang === "fr" ? "Spécialiste du Nettoyage" : "Cleaning Specialist";
  }
  if (c.includes("telecom") || c.includes("security systems")) {
    return lang === "fr" ? "Ingénieur CCTV & Sécurité" : "CCTV & Security Engineer";
  }
  if (c.includes("health") || c.includes("beauty")) {
    return lang === "fr" ? "Coiffeur / Styliste Beauté" : "Hair Stylist";
  }

  return category;
}

export function resolveServiceCategoryTag(item: any, lang: string = "en"): string {
  if (item.category && item.category !== "Technical Services" && item.category !== "General Contracting" && !isGarbageText(item.category)) {
    return item.category;
  }
  if (item.category_name && !isGarbageText(item.category_name)) return item.category_name;

  const profession = (resolveProfessionTitle(item, lang) || "").toLowerCase();
  const services = (item.services || []).map((s: any) => s.title || "").join(" ").toLowerCase();
  const skills = (item.skills || []).join(" ").toLowerCase();
  const allText = `${profession} ${services} ${skills}`;

  if (allText.includes("it ") || allText.includes("engineer") || allText.includes("network") || allText.includes("cyber") || allText.includes("software") || allText.includes("backend") || allText.includes("web")) {
    return lang === "fr" ? "Ingénierie Logicielle & IT" : "Software & Digital Engineering";
  }
  if (allText.includes("handyman") || allText.includes("plumb") || allText.includes("home")) {
    return lang === "fr" ? "Services de Bricolage & Plomberie" : "Handyman & Plumbing Services";
  }
  if (allText.includes("cctv") || allText.includes("secur") || allText.includes("telecom")) {
    return lang === "fr" ? "Télécoms & Systèmes de Sécurité" : "Telecom & Security Systems";
  }
  if (allText.includes("clean")) {
    return lang === "fr" ? "Services de Nettoyage & Entretien" : "Cleaning & Environmental Services";
  }
  if (allText.includes("hair") || allText.includes("beauty")) {
    return lang === "fr" ? "Soins, Beauté & Coiffure" : "Health, Beauty & Personal Care";
  }
  if (allText.includes("electric") || allText.includes("phone")) {
    return lang === "fr" ? "Génie Électrique & Électronique" : "Electrical & Electronics Engineering";
  }
  if (allText.includes("auto") || allText.includes("mechanic")) {
    return lang === "fr" ? "Services Automobile" : "Automotive & Heavy Equipment";
  }

  if (item.type === "company" || item.role === "company") {
    return lang === "fr" ? "Services Généraux d'Entreprise" : "General Contracting Services";
  }

  return lang === "fr" ? "Services Techniques" : "Technical Services";
}

export function resolveProfessionalBio(item: any, lang: string = "en"): string {
  // 1. If service has description, use it
  const services = item.services || item.profile?.services || [];
  if (Array.isArray(services) && services.length > 0 && services[0]?.description && !isGarbageText(services[0].description)) {
    return services[0].description;
  }

  // 2. If user has authentic bio
  if (item.bio && !isGarbageText(item.bio)) {
    return item.bio;
  }
  if (item.description && !isGarbageText(item.description)) {
    return item.description;
  }

  // 3. Match description strictly to their actual profession / service discipline
  const role = (resolveProfessionTitle(item, lang) || "").toLowerCase();
  const servicesText = services.map((s: any) => s.title || "").join(" ").toLowerCase();
  const allText = `${role} ${servicesText}`;

  if (allText.includes("it") || allText.includes("software") || allText.includes("backend") || allText.includes("web") || allText.includes("network")) {
    return lang === "fr"
      ? "Expertise en systèmes IT, développement logiciel, bases de données et maintenance réseaux."
      : "Expertise in IT systems, software development, database optimization, and network solutions.";
  }
  if (allText.includes("plumb")) {
    return lang === "fr"
      ? "Réparations de fuites, installations sanitaires, canalisations et maintenance plomberie."
      : "Leak repairs, bathroom installations, drainage systems, and plumbing maintenance.";
  }
  if (allText.includes("electr") || allText.includes("wiring")) {
    return lang === "fr"
      ? "Installations électriques résidentielles et commerciales, dépannages et mises aux normes."
      : "Residential & commercial electrical installations, repairs, wiring, and safety inspections.";
  }
  if (allText.includes("cctv") || allText.includes("secur")) {
    return lang === "fr"
      ? "Vidéosurveillance CCTV, contrôle d'accès, systèmes d'alarme et sécurité connectée."
      : "CCTV, access control, alarm systems, and smart surveillance security solutions.";
  }
  if (allText.includes("auto") || allText.includes("mechanic")) {
    return lang === "fr"
      ? "Diagnostics moteur, freins, révisions mécaniques et maintenance automobile complète."
      : "Engine diagnostics, brake service, mechanical repairs, and automotive maintenance.";
  }
  if (allText.includes("clean")) {
    return lang === "fr"
      ? "Nettoyage professionnel de bureaux, résidences, et entretien des locaux."
      : "Home, office, and post-construction professional cleaning & maintenance services.";
  }
  if (allText.includes("hair") || allText.includes("beauty")) {
    return lang === "fr"
      ? "Services professionnels de coiffure, soins et esthétique sur rendez-vous."
      : "Professional hair styling, grooming, and personal care services at your location.";
  }

  return lang === "fr"
    ? "Professionnel certifié disponible pour interventions rapides et missions techniques."
    : "Certified technical professional available for dispatch, task delivery, and projects.";
}
