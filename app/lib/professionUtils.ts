// Helper to intelligently resolve profession title & category tag for technicians/companies

export function resolveProfessionTitle(item: any, lang: string = "en"): string {
  if (!item) return lang === "fr" ? "Spécialiste" : "Specialist";

  // If company
  const isCompany = item.type === "company" || item.role?.toString().toLowerCase() === "company";
  if (isCompany) {
    if (item.category && item.category !== "General Contracting") return item.category;
    if (item.category_name) return item.category_name;
    return lang === "fr" ? "Entreprise Agréée" : "Registered Enterprise";
  }

  // 1. Check direct specific specialty / profession / headline
  const explicitRole = item.specialty || item.profession || item.headline || item.title;
  if (explicitRole && typeof explicitRole === "string") {
    const clean = explicitRole.trim();
    const lower = clean.toLowerCase();
    const genericTerms = ["technician", "technicien", "user", "client", "member", "service provider", "provider"];
    if (!genericTerms.includes(lower)) {
      return clean;
    }
  }

  // 2. Check services offered (e.g. "IT ENGINEER", "Plumbing Repair", "Electrician", "House Cleaner")
  const services = item.services || item.profile?.services || [];
  if (Array.isArray(services) && services.length > 0 && services[0]?.title) {
    const srvTitle = services[0].title.trim();
    if (srvTitle && !["technician", "service"].includes(srvTitle.toLowerCase())) {
      // Capitalize nicely if all uppercase
      if (srvTitle === srvTitle.toUpperCase() && srvTitle.length > 3) {
        return srvTitle.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      }
      return srvTitle;
    }
  }

  // 3. Check skills list (e.g. ["Plumber"], ["Electrician"], ["Welder"], ["Painter"], ["Cleaner"])
  const skills = item.skills || item.profile?.skills || [];
  if (Array.isArray(skills) && skills.length > 0) {
    const primarySkill = skills[0];
    if (typeof primarySkill === "string" && primarySkill.trim()) {
      return formatSkillToProfession(primarySkill.trim(), lang);
    }
  }

  // 4. Check category / category_name (e.g. "Handyman & Home Maintenance" -> "Handyman")
  const cat = item.category || item.category_name || item.service_category;
  if (cat && typeof cat === "string") {
    return formatCategoryToProfession(cat.trim(), lang);
  }

  // Fallback
  return lang === "fr" ? "Spécialiste Technique" : "Technical Specialist";
}

export function formatSkillToProfession(skill: string, lang: string = "en"): string {
  const s = skill.toLowerCase();
  if (s.includes("plumb")) return lang === "fr" ? "Plombier Qualifié" : "Plumber";
  if (s.includes("electr") || s.includes("wiring")) return lang === "fr" ? "Électricien Qualifié" : "Electrician";
  if (s.includes("weld")) return lang === "fr" ? "Soudeur Qualifié" : "Welder";
  if (s.includes("clean")) return lang === "fr" ? "Agent de Nettoyage" : "Cleaning Specialist";
  if (s.includes("paint")) return lang === "fr" ? "Peintre en Bâtiment" : "Painter";
  if (s.includes("carpent") || s.includes("wood")) return lang === "fr" ? "Menuisier / Charpentier" : "Carpenter";
  if (s.includes("mason") || s.includes("brick")) return lang === "fr" ? "Maçon Qualifié" : "Mason / Builder";
  if (s.includes("mechanic") || s.includes("auto")) return lang === "fr" ? "Mécanicien Automobile" : "Auto Mechanic";
  if (s.includes("hvac") || s.includes("air cond") || s.includes("climat")) return lang === "fr" ? "Technicien CVC / Climatisation" : "HVAC Specialist";
  if (s.includes("soft") || s.includes("web") || s.includes("develop")) return lang === "fr" ? "Ingénieur Logiciel" : "Software Engineer";
  if (s.includes("network") || s.includes("it ") || s.includes("system")) return lang === "fr" ? "Ingénieur Réseaux & IT" : "IT Engineer";
  if (s.includes("handy")) return lang === "fr" ? "Homme à tout faire" : "Handyman";

  // Return formatted skill
  return skill.charAt(0).toUpperCase() + skill.slice(1);
}

export function formatCategoryToProfession(category: string, lang: string = "en"): string {
  const c = category.toLowerCase();
  if (c.includes("handyman") || c.includes("home maintenance")) {
    return lang === "fr" ? "Artisan / Homme à tout faire" : "Handyman Specialist";
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
    return lang === "fr" ? "Électricien / Ingénieur Électrique" : "Electrical Specialist";
  }
  if (c.includes("civil") || c.includes("construction") || c.includes("architecture")) {
    return lang === "fr" ? "Spécialiste BTP & Construction" : "Civil & Construction Specialist";
  }
  if (c.includes("mechanical") || c.includes("industrial")) {
    return lang === "fr" ? "Ingénieur Mécanique & Industriel" : "Mechanical Engineer";
  }
  if (c.includes("automotive") || c.includes("heavy equipment")) {
    return lang === "fr" ? "Technicien Automobile & Engins" : "Automotive Specialist";
  }
  if (c.includes("clean") || c.includes("environmental")) {
    return lang === "fr" ? "Spécialiste Nettoyage & Entretien" : "Cleaning Specialist";
  }
  if (c.includes("telecom") || c.includes("security systems")) {
    return lang === "fr" ? "Spécialiste Télécoms & Sécurité" : "Telecom & Security Specialist";
  }
  if (c.includes("transport") || c.includes("logistics")) {
    return lang === "fr" ? "Professionnel Transport & Logistique" : "Transport & Logistics Pro";
  }
  if (c.includes("plumb")) {
    return lang === "fr" ? "Plombier Qualifié" : "Plumber";
  }

  return category;
}

export function resolveServiceCategoryTag(item: any, lang: string = "en"): string {
  if (item.category && item.category !== "Technical Services" && item.category !== "General Contracting") {
    return item.category;
  }
  if (item.category_name) return item.category_name;

  const profession = (resolveProfessionTitle(item, lang) || "").toLowerCase();
  const skills = (item.skills || []).join(" ").toLowerCase();
  const allText = `${profession} ${skills}`;

  if (allText.includes("handyman") || allText.includes("home")) {
    return lang === "fr" ? "Services de Bricolage" : "Handyman Services";
  }
  if (allText.includes("engineer") || allText.includes("software") || allText.includes("civil") || allText.includes("mechanical")) {
    return lang === "fr" ? "Services d'Ingénierie" : "Engineering Services";
  }
  if (allText.includes("it") || allText.includes("network") || allText.includes("cyber") || allText.includes("web")) {
    return lang === "fr" ? "Services IT & Numériques" : "IT & Digital Services";
  }
  if (allText.includes("clean")) {
    return lang === "fr" ? "Services de Nettoyage" : "Cleaning Services";
  }
  if (allText.includes("electric") || allText.includes("plumb") || allText.includes("weld") || allText.includes("auto")) {
    return lang === "fr" ? "Services Techniques & Métiers" : "Technical & Trade Services";
  }

  if (item.type === "company" || item.role === "company") {
    return lang === "fr" ? "Services Généraux d'Entreprise" : "General Contracting Services";
  }

  return lang === "fr" ? "Services Techniques" : "Technical Services";
}
