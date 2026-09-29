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
  if (clean.length < 2 || clean.length > 80) return true;
  if (INVALID_TERMS.includes(clean)) return true;

  // Check if contains long repeated characters (e.g. "aaaaaaa")
  if (/(.)\1{3,}/.test(clean)) return true;

  // Check long consonant clusters of 6 or more in a single word
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(clean)) return true;

  return false;
}

function cleanDegreeTitle(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  let clean = raw.trim();
  clean = clean.replace(/^(certified\s+)?(bachelor\s+of\s+|master\s+of\s+|phd\s+in\s+|degree\s+in\s+|diploma\s+in\s+|certificate\s+in\s+|license\s+in\s+)/i, "");
  clean = clean.replace(/^(bachelor|master|diploma|degree)\s+/i, "");
  clean = clean.trim();
  if (clean.toLowerCase().includes("electrical enginee")) return "Electrical Engineer";
  if (clean.toLowerCase().includes("civil enginee")) return "Civil Engineer";
  if (clean.toLowerCase().includes("mechanical enginee")) return "Mechanical Engineer";
  if (clean.toLowerCase().includes("computer") || clean.toLowerCase().includes("software")) return "Software Engineer";
  return clean ? (clean.charAt(0).toUpperCase() + clean.slice(1)) : "";
}

export function resolveProfessionTitle(item: any, lang: string = "en"): string {
  if (!item) return lang === "fr" ? "Entreprise & Ingénierie" : "General Contractors & Civil Engineering";

  // If company
  const isCompany = item.type === "company" || item.role?.toString().toLowerCase() === "company";
  if (isCompany) {
    if (item.headline && !isGarbageText(item.headline)) return item.headline;
    if (item.tagline && !isGarbageText(item.tagline)) return item.tagline;
    if (item.company_type && !isGarbageText(item.company_type)) return item.company_type;
    if (item.category && item.category !== "General Contracting" && item.category !== "Technical Services" && !isGarbageText(item.category)) {
      return item.category;
    }
    if (item.category_name && !isGarbageText(item.category_name)) return item.category_name;

    // Check services offered or skills for company
    const services = item.services || item.services_offered || item.servicesOffered || [];
    if (Array.isArray(services) && services.length > 0) {
      const firstSrv = typeof services[0] === "string" ? services[0] : services[0]?.title || services[0]?.name;
      if (firstSrv && !isGarbageText(firstSrv)) return firstSrv;
    }
    const skills = item.skills || [];
    if (Array.isArray(skills) && skills.length > 0 && !isGarbageText(skills[0])) {
      return formatSkillToProfession(skills[0], lang);
    }

    // Infer from company name
    const compName = (item.name || item.company_name || "").toLowerCase();
    if (compName.includes("dripline") || compName.includes("tech") || compName.includes("soft") || compName.includes("digital")) {
      return lang === "fr" ? "Agence Digitale & Ingénierie Logicielle" : "Software & Digital Engineering";
    }
    if (compName.includes("maison") || compName.includes("electr") || compName.includes("elec")) {
      return lang === "fr" ? "Installations Électriques & Bâtiment" : "Electrical Systems & Building";
    }
    if (compName.includes("build") || compName.includes("construct") || compName.includes("btp") || compName.includes("civil")) {
      return lang === "fr" ? "Génie Civil & Entreprise Générale" : "General Contractors & Civil Engineering";
    }

    return lang === "fr" ? "Entreprise Générale & Ingénierie" : "General Contractors & Civil Engineering";
  }

  // 1. TOP PRIORITY: Primary Trade / Occupation chosen by the technician
  const tradeRole = item.primary_occupation || item.trade_category || item.primary_trade || item.specialization || item.trade || item.technician_profile?.primary_occupation || item.technician_profile?.trade_category || item.technician_profile?.occupation;
  if (tradeRole && typeof tradeRole === "string" && !isGarbageText(tradeRole)) {
    const cleanedTrade = cleanDegreeTitle(tradeRole.trim());
    if (cleanedTrade && !isGarbageText(cleanedTrade)) return cleanedTrade;
  }

  // 2. Explicit Profession / Headline (if NOT generic like "Professional Specialist")
  const explicitRole = item.headline || item.profession || item.specialty || item.title || item.technician_profile?.headline;
  if (explicitRole && typeof explicitRole === "string" && !isGarbageText(explicitRole)) {
    const cleaned = cleanDegreeTitle(explicitRole.trim());
    if (cleaned && !isGarbageText(cleaned)) return cleaned;
  }

  // 3. Primary Industry Domain / Category
  const cat = item.category || item.category_name || item.service_category || item.primary_domain || item.industry || item.technician_profile?.category;
  if (cat && typeof cat === "string" && !isGarbageText(cat) && cat.toLowerCase() !== "technical services") {
    return formatCategoryToProfession(cat.trim(), lang);
  }

  // 4. Services offered posted by technician in their profile
  const services = item.services || item.profile?.services || item.technician_profile?.services || item.services_offered || [];
  if (Array.isArray(services) && services.length > 0) {
    const firstSrv = typeof services[0] === "string" ? services[0] : services[0]?.title || services[0]?.name;
    if (firstSrv && typeof firstSrv === "string" && !isGarbageText(firstSrv.trim())) {
      const srvTitle = firstSrv.trim();
      if (srvTitle === srvTitle.toUpperCase() && srvTitle.length > 3) {
        return srvTitle.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      }
      return cleanDegreeTitle(srvTitle);
    }
  }

  // 5. Skills list
  const skills = item.skills || item.profile?.skills || item.technician_profile?.skills || [];
  if (Array.isArray(skills) && skills.length > 0) {
    const validSkill = skills.find((s: string) => typeof s === "string" && !isGarbageText(s));
    if (validSkill) {
      return formatSkillToProfession(validSkill.trim(), lang);
    }
  }

  // 6. Education
  const edu = item.education_level || item.expertise_level;
  if (edu && typeof edu === "string" && !isGarbageText(edu)) {
    const cleanedEdu = cleanDegreeTitle(edu);
    if (cleanedEdu && !isGarbageText(cleanedEdu)) return cleanedEdu;
  }

  return lang === "fr" ? "Spécialiste Technique Certifié" : "Certified Technical Specialist";
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
  if (c.includes("handyman") || c.includes("home maintenance") || c.includes("plumb")) {
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
    return lang === "fr" ? "Ingénieur Génie Civil & BTP" : "Civil & Construction Engineer";
  }
  if (c.includes("mechanical") || c.includes("industrial")) {
    return lang === "fr" ? "Ingénieur Mécanique & Industriel" : "Mechanical Engineer";
  }
  if (c.includes("automotive") || c.includes("heavy equipment")) {
    return lang === "fr" ? "Mécanicien Automobile" : "Auto Mechanic";
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

export function resolveExpertiseTags(item: any, lang: string = "en"): string[] {
  // 1. Direct skills if available
  const skills = item.skills || item.profile?.skills || item.technician_profile?.skills || [];
  if (Array.isArray(skills) && skills.length > 0) {
    const valid = skills.filter((s: string) => !isGarbageText(s)).map((s: string) => s.trim());
    if (valid.length > 0) return valid;
  }

  // 2. Services titles
  const services = item.services || item.profile?.services || item.technician_profile?.services || [];
  if (Array.isArray(services) && services.length > 0) {
    const srvTitles = services.map((s: any) => s.title).filter((t: string) => Boolean(t) && !isGarbageText(t));
    if (srvTitles.length > 0) return srvTitles;
  }

  // 3. Domain fallback based on profession
  const prof = (resolveProfessionTitle(item, lang) || "").toLowerCase();
  if (prof.includes("plumb") || prof.includes("water") || prof.includes("sanitation")) {
    return lang === "fr" ? ["Plomberie", "Tuyauterie", "Sanitaire", "Dépannage"] : ["Plumbing", "Pipe Fitting", "Drainage", "Installation"];
  }
  if (prof.includes("electr") || prof.includes("câblage") || prof.includes("wiring")) {
    return lang === "fr" ? ["Câblage", "Installation", "Tableau Électrique", "Dépannage"] : ["Electrical Wiring", "Circuit Repair", "Panel Upgrade", "Safety Check"];
  }
  if (prof.includes("civil") || prof.includes("construction") || prof.includes("mason") || prof.includes("bâtiment")) {
    return lang === "fr" ? ["Génie Civil", "Maçonnerie", "Structure", "Chantier BTP"] : ["Civil Works", "Masonry", "Structural Engineering", "Renovation"];
  }
  if (prof.includes("cctv") || prof.includes("secur") || prof.includes("telecom")) {
    return lang === "fr" ? ["Vidéosurveillance", "CCTV", "Contrôle d'accès", "Réseaux"] : ["CCTV Setup", "Surveillance", "Access Control", "Security Wiring"];
  }
  if (prof.includes("auto") || prof.includes("mechanic") || prof.includes("véhicule")) {
    return lang === "fr" ? ["Diagnostic Moteur", "Freinage", "Entretien Auto", "Mécanique"] : ["Engine Diagnostics", "Brake Repair", "Vehicle Service", "Tune-Up"];
  }
  if (prof.includes("soft") || prof.includes("web") || prof.includes("it") || prof.includes("network") || prof.includes("dev")) {
    return lang === "fr" ? ["Développement Web", "Solutions IT", "Réseaux", "Base de Données"] : ["Web Development", "IT Solutions", "Network Systems", "Backend API"];
  }
  if (prof.includes("carpent") || prof.includes("menuis") || prof.includes("wood")) {
    return lang === "fr" ? ["Menuiserie", "Ameublement", "Bois & Finitions", "Pose"] : ["Carpentry", "Custom Furniture", "Woodwork", "Installation"];
  }
  if (prof.includes("clean") || prof.includes("nettoyage")) {
    return lang === "fr" ? ["Nettoyage Pro", "Entretien Bureaux", "Désinfection"] : ["Commercial Cleaning", "Office Care", "Sanitization"];
  }

  return lang === "fr" ? ["Assistance Technique", "Maintenance Pro", "Intervention Rapide"] : ["Technical Service", "Quality Maintenance", "Quick Dispatch"];
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

export function isStreetAddress(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  const s = str.trim().toLowerCase();
  return (
    s.startsWith("rue ") ||
    s.startsWith("ave ") ||
    s.startsWith("avenue ") ||
    s.startsWith("bd ") ||
    s.startsWith("boulevard ") ||
    s.startsWith("bloc ") ||
    s.startsWith("block ") ||
    s.startsWith("lot ") ||
    s.startsWith("plot ") ||
    s.startsWith("door ") ||
    s.startsWith("villa ") ||
    s.startsWith("no ") ||
    s.startsWith("no.") ||
    s.startsWith("apt ") ||
    s.startsWith("appt ") ||
    s.startsWith("street ") ||
    s.startsWith("st. ") ||
    s.startsWith("road ") ||
    s.startsWith("rd ") ||
    s.startsWith("carré ") ||
    s.startsWith("carre ") ||
    s.startsWith("zone ") ||
    /^\d+\s+[a-z]/i.test(s)
  );
}

function cleanPlaceString(name: string): string {
  if (!name) return "";
  return name.replace(/[\]\[\(\)\{\}#]/g, "").trim();
}

export function resolveCleanLocation(item: any): string {
  if (!item) return "West Africa";

  const rawNeighborhood = cleanPlaceString(
    (item.neighborhood || item.user?.neighborhood || item.company_profile?.neighborhood || item.technician_profile?.neighborhood || "").toString()
  );
  const rawCity = cleanPlaceString((item.city || item.user?.city || item.company_profile?.city || item.technician_profile?.city || "").toString());
  const rawCountry = cleanPlaceString((item.country || item.user?.country || item.company_profile?.country || item.technician_profile?.country || "").toString());

  // 1. If explicit neighborhood and city (e.g. "Akwa, Douala" or "Bastos, Yaoundé")
  if (rawNeighborhood && !isStreetAddress(rawNeighborhood) && !isGarbageText(rawNeighborhood)) {
    if (rawCity && !isStreetAddress(rawCity) && !isGarbageText(rawCity) && rawNeighborhood.toLowerCase() !== rawCity.toLowerCase()) {
      return `${rawNeighborhood}, ${rawCity}`;
    }
    return rawNeighborhood;
  }

  // 2. Extract from raw address/location
  const rawLoc = (
    item.location ||
    item.coverage_area ||
    item.headquarters ||
    item.address ||
    item.user?.address ||
    rawCountry ||
    ""
  ).toString().trim();

  if (!rawLoc) {
    return rawCountry && !isGarbageText(rawCountry) ? rawCountry : "West Africa";
  }

  // Split and deduplicate components (e.g. "Yaounde, Cameroon, Cameroon" -> ["Yaounde", "Cameroon"])
  const rawParts = rawLoc.split(/[,;\/]+/).map((p: string) => cleanPlaceString(p)).filter(Boolean);
  const uniqueParts: string[] = [];
  for (const p of rawParts) {
    const cleanP = cleanPlaceString(p);
    if (!cleanP || isStreetAddress(cleanP) || /^[\d\s\-_]+$/.test(cleanP) || isGarbageText(cleanP)) continue;
    if (!uniqueParts.some(existing => existing.toLowerCase() === cleanP.toLowerCase())) {
      uniqueParts.push(cleanP);
    }
  }

  if (uniqueParts.length >= 3) {
    // [Akwa, Douala, Cameroon] -> "Akwa, Douala" (Neighborhood, City)
    return `${uniqueParts[0]}, ${uniqueParts[1]}`;
  } else if (uniqueParts.length === 2) {
    return `${uniqueParts[0]}, ${uniqueParts[1]}`;
  } else if (uniqueParts.length === 1) {
    if (rawCountry && uniqueParts[0].toLowerCase() !== rawCountry.toLowerCase() && !isGarbageText(rawCountry)) {
      return `${uniqueParts[0]}, ${rawCountry}`;
    }
    return uniqueParts[0];
  }

  if (rawCity && !isGarbageText(rawCity)) {
    if (rawCountry && rawCity.toLowerCase() !== rawCountry.toLowerCase() && !isGarbageText(rawCountry)) {
      return `${rawCity}, ${rawCountry}`;
    }
    return rawCity;
  }

  return rawCountry && !isGarbageText(rawCountry) ? rawCountry : "West Africa";
}

