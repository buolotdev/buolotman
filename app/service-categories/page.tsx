"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./service-categories.css";

interface CategoryItem {
  id: string;
  num: string;
  title: string;
  description: string;
  badge: string;
  type: "home" | "technical" | "professional" | "business";
  provider: "professional" | "company" | "both";
  searchKeywords: string;
  services: string[];
  linkUrl: string;
  linkText: string;
  providerLabel: string;
}

const MASTER_CATEGORIES_DATA: CategoryItem[] = [
  {
    id: "construction",
    num: "01",
    title: "Construction & Building",
    description: "Find skilled construction professionals and companies for building, renovation, structural works and property development.",
    badge: "Popular",
    type: "technical",
    provider: "both",
    searchKeywords: "construction building masonry bricklayer mason concrete foundation roofing renovation tiling plastering ceiling site work",
    services: [
      "Masonry", "Bricklaying", "Concrete Works", "Foundations", "Roofing",
      "Plastering", "Tiling", "Renovation", "Ceilings", "Site Works"
    ],
    linkUrl: "/categories/civil-construction-and-architecture",
    linkText: "Find Construction Professionals",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "electrical",
    num: "02",
    title: "Electrical & Power",
    description: "Electrical installation, troubleshooting, power systems, maintenance and technical electrical services.",
    badge: "High Demand",
    type: "technical",
    provider: "both",
    searchKeywords: "electrical electrician wiring power installation lighting generator inverter distribution board maintenance",
    services: [
      "House Wiring", "Commercial Wiring", "Lighting", "Distribution Boards",
      "Generator Installation", "Inverters", "Fault Repairs", "Earthing",
      "Maintenance", "Power Systems"
    ],
    linkUrl: "/categories/electrical-and-electronics-engineering",
    linkText: "Find Electricians",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "plumbing",
    num: "03",
    title: "Plumbing & Water Systems",
    description: "Connect with plumbers and water-system specialists for installations, repairs and larger water infrastructure work.",
    badge: "Popular",
    type: "technical",
    provider: "both",
    searchKeywords: "plumbing plumber water pipes drainage pump tank toilet sink leak borehole bathroom",
    services: [
      "Pipe Installation", "Leak Repairs", "Bathrooms", "Toilets",
      "Kitchen Plumbing", "Water Tanks", "Pumps", "Drainage",
      "Borehole Systems", "Water Networks"
    ],
    linkUrl: "/categories/mechanical-and-industrial-engineering",
    linkText: "Find Plumbers",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "carpentry",
    num: "04",
    title: "Carpentry & Woodwork",
    description: "Hire carpenters and woodworking specialists for furniture, doors, cabinets, fittings and custom wood projects.",
    badge: "Skilled Trade",
    type: "technical",
    provider: "both",
    searchKeywords: "carpenter carpentry wood furniture doors cabinets wardrobes kitchen woodworking joinery",
    services: [
      "Furniture Making", "Doors", "Wardrobes", "Kitchen Cabinets",
      "Custom Woodwork", "Joinery", "Repairs", "Interior Woodwork"
    ],
    linkUrl: "/categories/handyman-and-home-maintenance",
    linkText: "Find Carpenters",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "welding",
    num: "05",
    title: "Welding & Metal Fabrication",
    description: "Find welders and fabrication companies for metal structures, gates, railings, repairs and custom steel work.",
    badge: "Skilled Trade",
    type: "technical",
    provider: "both",
    searchKeywords: "welding welder metal steel fabrication gate railing windows structure metalwork",
    services: [
      "Steel Fabrication", "Gates", "Railings", "Metal Doors",
      "Window Grilles", "Structural Welding", "Repairs", "Custom Metalwork"
    ],
    linkUrl: "/categories/civil-construction-and-architecture",
    linkText: "Find Welders",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "painting",
    num: "06",
    title: "Painting & Finishing",
    description: "Interior and exterior painting, waterproofing, surface preparation and professional wall finishes.",
    badge: "Everyday Work",
    type: "home",
    provider: "both",
    searchKeywords: "painting painter wall finish plaster interior exterior coating waterproofing decor",
    services: [
      "Interior Painting", "Exterior Painting", "Waterproofing", "Surface Prep",
      "Wall Finishes", "Decorative Coatings", "Commercial Painting", "Touch-ups"
    ],
    linkUrl: "/categories/civil-construction-and-architecture",
    linkText: "Find Painters",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "hvac",
    num: "07",
    title: "AC & Refrigeration (HVAC)",
    description: "Air conditioning technicians, cold room specialists and refrigeration engineers for cooling services.",
    badge: "High Demand",
    type: "technical",
    provider: "both",
    searchKeywords: "ac air conditioning hvac cooling refrigeration cold room ventilation compressor gas refill",
    services: [
      "AC Installation", "AC Repair", "Gas Refill", "Maintenance",
      "Cold Rooms", "Commercial Refrigeration", "Chillers", "Ducting"
    ],
    linkUrl: "/categories/mechanical-and-industrial-engineering",
    linkText: "Find AC Technicians",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "solar",
    num: "08",
    title: "Solar & Renewable Energy",
    description: "Solar PV installations, battery backup systems, inverters and renewable energy engineering.",
    badge: "Fast Growing",
    type: "technical",
    provider: "both",
    searchKeywords: "solar panel inverter battery pv clean energy renewable backup power hybrid",
    services: [
      "Solar Panel Setup", "Inverter Installation", "Lithium Battery Banks",
      "Hybrid Solar", "Off-Grid Systems", "Energy Audits", "Solar Maintenance"
    ],
    linkUrl: "/categories/renewable-energy-and-utilities",
    linkText: "Find Solar Engineers",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "technology",
    num: "09",
    title: "Software & Digital Engineering",
    description: "Web development, mobile applications, APIs, databases, UI/UX design and custom software systems.",
    badge: "Digital Trade",
    type: "professional",
    provider: "both",
    searchKeywords: "software coding developer programmer web app mobile react nextjs backend frontend api database",
    services: [
      "Web Applications", "Mobile Apps (iOS/Android)", "Backend APIs",
      "Database Architecture", "UI/UX Design", "E-commerce", "QA Testing", "Cloud Integrations"
    ],
    linkUrl: "/categories/software-and-digital-engineering",
    linkText: "Find Software Engineers",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "it-networking",
    num: "10",
    title: "IT Infrastructure & Networking",
    description: "Network cabling, server administration, Wi-Fi coverage, data centers and technical IT support.",
    badge: "Enterprise",
    type: "professional",
    provider: "both",
    searchKeywords: "it network lan wan wifi router cisco server datacenter cabling fiber optic sysadmin",
    services: [
      "Structured Cabling", "Office LAN/WAN", "Router & Switch Config",
      "Server Setup", "Enterprise Wi-Fi", "Hardware Repair", "Remote IT Support"
    ],
    linkUrl: "/categories/it-infrastructure-and-networking",
    linkText: "Find IT Specialists",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "cybersecurity",
    num: "11",
    title: "Cybersecurity & Compliance",
    description: "Security audits, penetration testing, firewall hardening, compliance and data protection.",
    badge: "Specialized",
    type: "professional",
    provider: "both",
    searchKeywords: "security cyber penetration test firewall soc compliance gdpr iso forensics encryption",
    services: [
      "Vulnerability Scans", "Penetration Testing", "Firewall Configuration",
      "SOC Monitoring", "GDPR/ISO Compliance", "Malware Incident Response"
    ],
    linkUrl: "/categories/cybersecurity-services",
    linkText: "Find Security Experts",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "cleaning",
    num: "12",
    title: "Cleaning & Environmental",
    description: "Residential deep cleaning, commercial janitorial, fumigation, post-renovation and landscaping.",
    badge: "Everyday Work",
    type: "home",
    provider: "both",
    searchKeywords: "cleaning housekeeping deep clean janitorial maid office disinfection pest control fumigation lawn",
    services: [
      "Deep Housekeeping", "Office Janitorial", "Post-Construction Clean",
      "Fumigation & Pest Control", "Upholstery Steam Cleaning", "Lawn Care"
    ],
    linkUrl: "/categories/cleaning-outdoor-and-environmental-services",
    linkText: "Find Cleaning Providers",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "automotive",
    num: "13",
    title: "Automotive & Heavy Equipment",
    description: "Mechanical diagnostics, auto electrical, fleet maintenance, engine tuning and heavy machinery servicing.",
    badge: "Skilled Trade",
    type: "technical",
    provider: "both",
    searchKeywords: "car auto mechanic engine gearbox brake electrical diagnostics excavator forklift truck",
    services: [
      "Engine Diagnostics", "Auto Electrical", "Brakes & Suspension",
      "Fleet Maintenance", "Heavy Machinery", "Bodywork & Paint"
    ],
    linkUrl: "/categories/automotive-and-heavy-equipment",
    linkText: "Find Auto Mechanics",
    providerLabel: "Professionals & Companies"
  },
  {
    id: "personal-contracts",
    num: "14",
    title: "Household & Personal Contracts",
    description: "Longer-term qualified nannies, elderly caregivers, private chefs, family tutors and estate caretakers.",
    badge: "Longer-Term",
    type: "home",
    provider: "both",
    searchKeywords: "nanny caregiver chef tutor housekeeper driver domestic personal assistant contracts live in",
    services: [
      "Nannies & Childcare", "Elderly Companions", "Private Chefs",
      "Academic Tutors", "Private Drivers", "Estate Caretakers"
    ],
    linkUrl: "/contracts",
    linkText: "Explore Contract Roles",
    providerLabel: "Professionals & Agencies"
  },
  {
    id: "corporate-engineering",
    num: "15",
    title: "Engineering & Subcontracting",
    description: "Civil engineering blueprints, multidisciplinary contracting, industrial automation and BOQ surveys.",
    badge: "Corporate",
    type: "business",
    provider: "company",
    searchKeywords: "engineering civil architectural subcontracting boq quantity surveyor industrial project management",
    services: [
      "Architectural Design", "Turnkey Construction", "Quantity Surveying",
      "Industrial Automation", "Subcontracting Teams", "Site Supervision"
    ],
    linkUrl: "/contractors",
    linkText: "Find Engineering Companies",
    providerLabel: "Registered Companies"
  }
];

export default function ServiceCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const handleHeroSearch = (keyword: string) => {
    setSearchTerm(keyword);
    const element = document.getElementById("all-categories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredCategories = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return MASTER_CATEGORIES_DATA.filter((item) => {
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.searchKeywords.toLowerCase().includes(q) ||
        item.services.some((s) => s.toLowerCase().includes(q));

      const matchType = !selectedType || item.type === selectedType;

      let matchProvider = true;
      if (selectedProvider === "professional") {
        matchProvider = item.provider === "professional" || item.provider === "both";
      } else if (selectedProvider === "company") {
        matchProvider = item.provider === "company" || item.provider === "both";
      } else if (selectedProvider === "both") {
        matchProvider = item.provider === "both";
      }

      return matchSearch && matchType && matchProvider;
    });
  }, [searchTerm, selectedType, selectedProvider]);

  return (
    <>
      <Header />

      <main className="bm-categories-page">
        {/* HERO */}
        <section className="bm-categories-hero">
          <div className="bm-categories-container">
            <div className="bm-categories-hero-grid">
              <div>
                <div className="bm-categories-eyebrow">
                  Boulot Man Service Marketplace
                </div>

                <h1>Find the Right Service for Any Job or Project</h1>

                <p className="bm-categories-hero-copy">
                  Browse Boulot Man service categories to find verified technicians,
                  engineers, professionals and companies for everyday work, skilled services,
                  repairs, construction and larger technical projects across Africa.
                </p>

                <div className="bm-categories-hero-actions">
                  <a href="#all-categories" className="bm-categories-btn bm-categories-btn-primary">
                    Browse Categories
                  </a>
                  <Link href="/post-task" className="bm-categories-btn bm-categories-btn-secondary">
                    Post a Task
                  </Link>
                </div>
              </div>

              <aside className="bm-categories-search-card">
                <h2>What service do you need?</h2>
                <p>Search by trade, profession, service or type of work.</p>

                <div className="bm-categories-search-wrap">
                  <input
                    type="search"
                    placeholder="e.g. plumber, electrician, web developer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleHeroSearch(searchTerm);
                      }
                    }}
                  />
                  <span className="bm-categories-search-icon">⌕</span>
                </div>

                <div className="bm-categories-popular">
                  {["Plumbing", "Electrical", "Construction", "Cleaning", "Technology", "AC Repair", "Solar"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleHeroSearch(tag)}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* VALUE STRIP */}
        <section className="bm-categories-strip">
          <div className="bm-categories-container">
            <div className="bm-categories-strip-grid">
              <div className="bm-categories-strip-item">
                <strong>Everyday Services</strong>
                <span>Repairs, maintenance, cleaning and household support.</span>
              </div>
              <div className="bm-categories-strip-item">
                <strong>Skilled Trades</strong>
                <span>Qualified technicians and specialist service providers.</span>
              </div>
              <div className="bm-categories-strip-item">
                <strong>Professional Services</strong>
                <span>Engineering, technology, design and business expertise.</span>
              </div>
              <div className="bm-categories-strip-item">
                <strong>Larger Projects</strong>
                <span>Companies, project teams and enterprise execution.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ALL CATEGORIES */}
        <section className="bm-categories-section" id="all-categories">
          <div className="bm-categories-container">
            <div className="bm-categories-section-head">
              <div className="bm-categories-head-copy">
                <div className="bm-categories-kicker">All service categories</div>
                <h2 className="bm-categories-title">
                  Explore Services Across the Boulot Man Network
                </h2>
                <p className="bm-categories-copy">
                  Search the category that best matches your work. Individual tasks can be handled
                  by verified professionals, while larger requirements can be matched with registered
                  companies or structured project teams.
                </p>
              </div>
            </div>

            {/* FILTERS */}
            <div className="bm-categories-filter-card">
              <div className="bm-categories-filter-grid">
                <div className="bm-categories-field">
                  <label htmlFor="bmCategorySearch">Search services</label>
                  <input
                    type="search"
                    id="bmCategorySearch"
                    placeholder="Search category or service keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="bm-categories-field">
                  <label htmlFor="bmCategoryType">Service Domain</label>
                  <select
                    id="bmCategoryType"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Domains</option>
                    <option value="home">Home &amp; Property</option>
                    <option value="technical">Technical Trades</option>
                    <option value="professional">Professional &amp; Digital</option>
                    <option value="business">Business &amp; Commercial</option>
                  </select>
                </div>

                <div className="bm-categories-field">
                  <label htmlFor="bmCategoryProvider">Provider Type</label>
                  <select
                    id="bmCategoryProvider"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    <option value="">All Providers</option>
                    <option value="professional">Individual Professionals</option>
                    <option value="company">Registered Companies</option>
                    <option value="both">Professionals &amp; Companies</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="bm-categories-filter-btn"
                  onClick={() => handleHeroSearch(searchTerm)}
                >
                  Filter ({filteredCategories.length})
                </button>
              </div>
            </div>

            {/* CATEGORIES GRID */}
            <div className="bm-category-grid" id="bmCategoryGrid">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <article key={cat.id} className="bm-category-card">
                    <div className="bm-category-card-main">
                      <div className="bm-category-card-top">
                        <div className="bm-category-icon">{cat.num}</div>
                        <span className="bm-category-badge">{cat.badge}</span>
                      </div>

                      <h3>{cat.title}</h3>
                      <p>{cat.description}</p>

                      <ul className="bm-category-services">
                        {cat.services.map((svc, idx) => (
                          <li key={idx}>{svc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bm-category-card-footer">
                      <Link href={cat.linkUrl}>{cat.linkText} →</Link>
                      <span>{cat.providerLabel}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bm-categories-empty">
                  <h3>No matching categories found</h3>
                  <p>Try searching for a different keyword, trade, or clearing your filters.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bm-categories-section" style={{ background: "#ffffff", borderTop: "1px solid #e3e7ec" }}>
          <div className="bm-categories-container">
            <div className="bm-categories-section-head">
              <div className="bm-categories-kicker">HOW IT WORKS</div>
              <h2 className="bm-categories-title">A Clear Way to Get Work Done</h2>
            </div>

            <div className="bm-categories-how-grid">
              <a href="#all-categories" style={{ textDecoration: "none", color: "inherit" }} className="bm-categories-how-card">
                <strong>01</strong>
                <h3>Select a Category</h3>
                <p>Find the trade, engineering domain, or personal service that matches your requirement.</p>
              </a>
              <Link href="/post-task" style={{ textDecoration: "none", color: "inherit" }} className="bm-categories-how-card">
                <strong>02</strong>
                <h3>Post or Search</h3>
                <p>Post a task for quotes or browse verified profiles and companies directly.</p>
              </Link>
              <Link href="/service-providers/technicians" style={{ textDecoration: "none", color: "inherit" }} className="bm-categories-how-card">
                <strong>03</strong>
                <h3>Hire with Confidence</h3>
                <p>Review background checks, ratings, previous work portfolio, and pricing models.</p>
              </Link>
              <Link href="/payments-and-escrow" style={{ textDecoration: "none", color: "inherit" }} className="bm-categories-how-card">
                <strong>04</strong>
                <h3>Secure Escrow</h3>
                <p>Funds are held securely and only released when you inspect and approve milestones.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bm-categories-final">
          <div className="bm-categories-container">
            <div className="bm-categories-final-card">
              <div className="bm-categories-final-copy">
                <h2>Ready to get started?</h2>
                <p>
                  Join thousands of clients, technicians, and companies getting work done reliably
                  across Africa on Boulot Man.
                </p>
              </div>

              <div className="bm-categories-final-actions">
                <Link href="/post-task" className="bm-categories-btn bm-categories-btn-primary">
                  Post a Task Now
                </Link>
                <Link href="/signup" className="bm-categories-btn bm-categories-btn-secondary">
                  Join as a Professional
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
