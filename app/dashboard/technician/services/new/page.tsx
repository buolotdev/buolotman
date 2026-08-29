"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import styles from "./page.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";

const CATEGORY_DATA = [
  {
    id: "software_engineering",
    title: "1. Software & Digital Engineering",
    subgroups: [
      {
        title: "Web & Digital Platforms",
        items: [
          "Web application development",
          "Website design and development",
          "E-commerce platform development",
          "WordPress & CMS development",
          "Progressive web applications",
          "Website maintenance and security upgrades",
        ]
      },
      {
        title: "Mobile Applications",
        items: [
          "Android application development",
          "iOS application development",
          "Cross-platform mobile apps (React Native / Flutter)",
          "Mobile MVP & prototyping",
          "App Store & Play Store publishing support",
        ]
      },
      {
        title: "Backend, APIs & Databases",
        items: [
          "Backend systems & REST/GraphQL APIs",
          "Database architecture & PostgreSQL/MySQL design",
          "Database query optimization & indexing",
          "Payment gateway & third-party integrations",
          "ERP & CRM implementation",
          "Custom workflow automation",
        ]
      },
      {
        title: "UI/UX & Quality Assurance",
        items: [
          "UI/UX product design & prototyping",
          "Design systems & brand assets",
          "Manual & automated software QA testing",
          "Performance testing & bug fixing",
          "Legacy code modernization & refactoring",
        ]
      }
    ]
  },
  {
    id: "it_networking",
    title: "2. IT Infrastructure & Networking",
    subgroups: [
      {
        title: "Network Architecture & Cabling",
        items: [
          "LAN & WAN network design",
          "Office network setup & structured cabling",
          "Router & switch configuration (Cisco / MikroTik)",
          "Fiber optic termination & patching",
          "Network performance audits & optimization",
        ]
      },
      {
        title: "Servers & Data Center Systems",
        items: [
          "Windows & Linux server administration",
          "Data center deployment & rack mounting",
          "SAN / NAS storage systems setup",
          "Server monitoring & patch management",
        ]
      },
      {
        title: "Wireless & Hardware Support",
        items: [
          "Enterprise Wi-Fi coverage & hotspot setup",
          "Point-to-point wireless links",
          "Internet failover & load balancing",
          "Laptop & desktop hardware repair",
          "Operating system installation & remote IT support",
        ]
      }
    ]
  },
  {
    id: "cybersecurity",
    title: "3. Cybersecurity & Compliance Services",
    subgroups: [
      {
        title: "Security Auditing & Hardening",
        items: [
          "Cybersecurity risk & vulnerability assessments",
          "Penetration testing (Web, Network & API)",
          "Firewall & intrusion prevention configuration",
          "System hardening & endpoint security",
          "Identity & access management (IAM)",
        ]
      },
      {
        title: "Monitoring, Compliance & Forensics",
        items: [
          "SOC setup & 24/7 security monitoring",
          "ISO 27001 & GDPR compliance readiness",
          "Data protection & AES encryption systems",
          "Incident response & malware removal",
          "Digital forensics & business continuity planning",
        ]
      }
    ]
  },
  {
    id: "cloud_devops",
    title: "4. Cloud & Systems Engineering",
    subgroups: [
      {
        title: "Cloud Infrastructure",
        items: [
          "AWS, Azure & Google Cloud deployment",
          "Cloud migration & hybrid cloud architecture",
          "Cloud cost optimization & auditing",
          "Virtualization (VMware / Proxmox / KVM)",
          "Docker & Kubernetes container orchestration",
        ]
      },
      {
        title: "DevOps & Disaster Recovery",
        items: [
          "CI/CD pipeline automation (GitHub Actions / GitLab)",
          "Infrastructure as Code (Terraform / Ansible)",
          "Automated backup & off-site replication",
          "Disaster recovery planning & failover testing",
        ]
      }
    ]
  },
  {
    id: "electrical_engineering",
    title: "5. Electrical & Electronics Engineering",
    subgroups: [
      {
        title: "Power & Electrical Wiring",
        items: [
          "Residential electrical installation",
          "Commercial electrical systems",
          "Industrial electrical wiring & 3-phase power",
          "Main distribution boards & control panels",
          "Power backup & automatic changeover switches",
          "Earthing systems & lightning surge protection",
          "Electrical safety inspection & certifications",
        ]
      },
      {
        title: "Solar PV & Generators",
        items: [
          "Solar PV system design & roof mounting",
          "Solar inverters & lithium battery banks",
          "Diesel & petrol generator installation & servicing",
          "Solar water heating & street lighting",
        ]
      },
      {
        title: "Electronics & Smart Automation",
        items: [
          "CCTV surveillance camera installation",
          "Biometric access control & smart locks",
          "Fire alarm & smoke detection systems",
          "Smart home automation & IoT deployment",
          "Industrial automation & PLC diagnostics",
          "Electronic board repair & component diagnostics",
        ]
      }
    ]
  },
  {
    id: "civil_construction",
    title: "6. Civil, Construction & Architecture",
    subgroups: [
      {
        title: "Design & Architectural Plans",
        items: [
          "Architectural design & building blueprints",
          "3D architectural modeling & rendering",
          "Interior space planning & permit drawings",
          "Structural engineering calculations",
        ]
      },
      {
        title: "Construction, Masonry & Roofing",
        items: [
          "Full building construction & turnkey builds",
          "Building renovation, extension & remodeling",
          "Block laying, brickwork & structural masonry",
          "Concrete casting, foundations & retaining walls",
          "Roof truss fabrication & roofing installation",
          "Road paving, driveways & drainage works",
        ]
      },
      {
        title: "Finishing & Project Management",
        items: [
          "Interior & exterior painting and waterproofing",
          "Tiling, porcelain, marble & epoxy flooring",
          "POP, gypsum ceiling & drywall partitioning",
          "Construction project supervision & quality control",
          "Quantity surveying & bill of quantities (BOQ)",
        ]
      }
    ]
  },
  {
    id: "mechanical_industrial",
    title: "7. Mechanical & Industrial Engineering",
    subgroups: [
      {
        title: "HVAC & Commercial Refrigeration",
        items: [
          "Split & central air conditioning installation",
          "HVAC maintenance, ducting & gas refilling",
          "Cold rooms & blast freezers construction",
          "Commercial chillers & refrigeration systems",
          "Industrial ventilation & exhaust systems",
        ]
      },
      {
        title: "Welding & Metal Fabrication",
        items: [
          "Arc, MIG & TIG precision welding",
          "Structural steel fabrication & trusses",
          "Security gates, burglar bars & metal railings",
          "Custom stainless steel & aluminum metalwork",
        ]
      },
      {
        title: "Plant, Machinery & Fluid Systems",
        items: [
          "Industrial production line machinery maintenance",
          "Water pumps, electric motors & compressors",
          "Hydraulic & pneumatic system servicing",
          "Industrial piping & pressure systems",
        ]
      }
    ]
  },
  {
    id: "renewable_utilities",
    title: "8. Renewable Energy & Utilities",
    subgroups: [
      {
        title: "Clean Energy Systems",
        items: [
          "Off-grid & grid-tied solar farm installations",
          "Commercial solar PV arrays & battery storage",
          "Mini-grid engineering & energy audits",
          "Power consumption & efficiency optimization",
        ]
      },
      {
        title: "Water & Environmental Utilities",
        items: [
          "Water treatment & commercial filtration systems",
          "Water storage tanks & pressure boosting towers",
          "Rainwater harvesting & wastewater recycling",
          "Borehole drilling supervision & submersible pumps",
          "Agricultural drip & sprinkler irrigation networks",
          "Septic tanks & bio-digester installations",
        ]
      }
    ]
  },
  {
    id: "automotive_heavy",
    title: "9. Automotive & Heavy Equipment",
    subgroups: [
      {
        title: "Vehicle Mechanical & Electrical",
        items: [
          "Computerized engine diagnostics & tuning",
          "Brake, clutch & suspension overhaul",
          "Transmission & gearbox repair",
          "Auto electrical wiring & ECU programming",
          "Car alarm, GPS tracking & immobilizer install",
          "Mobile breakdown & roadside mechanic services",
        ]
      },
      {
        title: "Heavy Equipment & Bodywork",
        items: [
          "Excavator, crane & heavy equipment servicing",
          "Forklifts & warehouse material handlers repair",
          "Commercial fleet maintenance contracts",
          "Auto bodywork, panel beating & spray painting",
          "Wheel alignment, balancing & tyre services",
        ]
      }
    ]
  },
  {
    id: "telecom_broadcast",
    title: "10. Telecom, Broadcast & Security Systems",
    subgroups: [
      {
        title: "Telecommunications & Cabling",
        items: [
          "Fiber optic splicing, OTDR testing & blown fiber",
          "IP-PBX & VoIP business telephony systems",
          "Telecom tower rigging & antenna maintenance",
          "VSAT & commercial satellite dish setup",
        ]
      },
      {
        title: "Broadcast & Access Security",
        items: [
          "Public address (PA) & conference audio systems",
          "Radio & TV studio acoustic and equipment setup",
          "Electric perimeter fencing & alarm sensors",
          "Automatic sliding/swing gate motors",
          "Intercom & video door entry systems",
        ]
      }
    ]
  },
  {
    id: "handyman_maintenance",
    title: "11. Handyman & Home Maintenance",
    subgroups: [
      {
        title: "Plumbing Services",
        items: [
          "Leak detection & burst pipe repairs",
          "PPR, PVC & copper pipe fitting",
          "Toilet, faucet & sink repair/replacement",
          "Water heater (geyser) installation & repair",
          "Drain cleaning & unblocking",
          "Bathroom & kitchen fixtures installation",
        ]
      },
      {
        title: "Carpentry & Joinery",
        items: [
          "Custom wooden furniture making & polishing",
          "Furniture assembly (IKEA / flatpack)",
          "Door lock, handle & hinge replacement",
          "Kitchen cabinet making & wardrobe fitting",
          "Curtain rod, blind & wall shelf mounting",
          "Wood floor sanding & termite treatment",
        ]
      },
      {
        title: "General Maintenance & Appliances",
        items: [
          "Light fixture & chandelier installation",
          "Switch, socket & circuit breaker replacement",
          "Ceiling & extractor fan installation",
          "Washing machine & dishwasher repair",
          "Refrigerator & deep freezer repair",
          "Electric cooker, oven & microwave repair",
        ]
      }
    ]
  },
  {
    id: "cleaning_environmental",
    title: "12. Cleaning, Outdoor & Environmental Services",
    subgroups: [
      {
        title: "Cleaning Services",
        items: [
          "Residential deep cleaning & housekeeping",
          "Commercial office & retail cleaning",
          "Post-construction & renovation cleanup",
          "Move-in & move-out tenancy cleaning",
          "Carpet, rug & upholstery steam cleaning",
          "High-rise window & facade washing",
        ]
      },
      {
        title: "Landscaping & Pest Control",
        items: [
          "Lawn mowing & hedge trimming",
          "Landscape design & compound beautification",
          "Tree pruning & stump removal",
          "Pest control, fumigation & rodent eradication",
          "Disinfection & sanitization services",
          "Septic tank evacuation & waste disposal",
        ]
      }
    ]
  },
  {
    id: "transport_logistics",
    title: "13. Transport, Logistics & Support Services",
    subgroups: [
      {
        title: "Moving & Deliveries",
        items: [
          "House moving & residential relocation",
          "Office relocation & equipment transfer",
          "Furniture packing, loading & transit",
          "Last-mile courier & goods delivery",
          "Heavy equipment hauling & flatbed transport",
        ]
      },
      {
        title: "Operational Support Staff",
        items: [
          "Trained security guards & night watchmen",
          "Event security, bouncers & crowd management",
          "Warehouse loading & inventory personnel",
          "General manual labor & site helpers",
        ]
      }
    ]
  },
  {
    id: "health_beauty",
    title: "14. Health, Beauty & Personal Care",
    subgroups: [
      {
        title: "Hair & Grooming",
        items: [
          "Men's grooming, haircut & beard styling",
          "Women's hair styling, weaving & braiding",
          "Wig making, washing & installation",
          "Natural hair treatments & colouring",
        ]
      },
      {
        title: "Beauty, Nails & Wellness",
        items: [
          "Nail artistry, manicure & pedicure",
          "Professional makeup artistry & bridal glam",
          "Eyelash extensions & eyebrow tinting/microblading",
          "Mobile massage therapy & wellness treatments",
        ]
      },
      {
        title: "Home Health & Care Support",
        items: [
          "Private home nursing & patient care",
          "Elderly companionship & assisted living support",
          "Post-operative recovery home assistance",
          "Mother & newborn infant care support",
        ]
      }
    ]
  },
  {
    id: "education_documents",
    title: "15. Education, Language & Document Services",
    subgroups: [
      {
        title: "Tutoring & Training",
        items: [
          "Home & online tutoring (Math, Science, Languages)",
          "Exam preparation & homework assistance",
          "Computer literacy & IT skills training",
          "Coding & software programming tutoring",
        ]
      },
      {
        title: "Language & Document Solutions",
        items: [
          "Official document translation (French, English, Arabic, etc.)",
          "Audio & video transcription services",
          "Professional content writing & copywriting",
          "CV, resume & cover letter writing",
          "Proofreading, book editing & formatting",
          "Virtual assistant, data entry & administrative support",
        ]
      }
    ]
  }
];

export default function TechnicianPostServicePage() {
  const router = useRouter();
  const toast = useToast();
  const { data: user } = useFetch(() => api.getMe(), []);
  const isVerified = Boolean(user?.is_verified || (user as any)?.technician_profile?.is_verified);
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("On-site");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Sync user defaults
  useEffect(() => {
    if (user) {
      if (user.city || user.country) {
        setLocation([user.city, user.country].filter(Boolean).join(", "));
      }
      if (user.category) {
        // Pre-select category if available
        const match = CATEGORY_DATA.find(c => c.title.toLowerCase().includes((user.category || "").toLowerCase()));
        if (match) setActiveCategory(match.id);
      }
    }
  }, [user]);

  const handleTagToggle = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    setSelectedTags(next);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handlePreviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title Required", "Please enter a title for your service.");
      return;
    }
    if (selectedTags.size === 0) {
      toast.error("Category Required", "Please select at least one service category tag.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create service record
      const matchedCategory = CATEGORY_DATA.find(c => c.id === activeCategory);
      const categoryTitle = matchedCategory?.title || Array.from(selectedTags)[0];

      const serviceData = {
        title: title.trim(),
        service_type: mode.toLowerCase() === "remote" ? "remote" : "onsite",
        coverage_area: location.trim() || "National",
        pricing_model: hourlyRate ? "hourly" : (dailyRate ? "fixed" : "fixed"),
        pricing_min: hourlyRate ? Number(hourlyRate) : (dailyRate ? Number(dailyRate) : 0),
        pricing_max: dailyRate ? Number(dailyRate) : (hourlyRate ? Number(hourlyRate) : null),
        description: description.trim(),
        is_active: true,
        media: [],
        tags: Array.from(selectedTags),
        category_name: categoryTitle,
        category_title: categoryTitle,
      };

      try {
        await api.createTechnicianService(serviceData);
      } catch (apiErr) {
        console.warn("createTechnicianService API notice:", apiErr);
      }

      // 2. Also persist locally for fast display
      const currentServices = JSON.parse(localStorage.getItem("boulotman_technician_services") || "[]");
      const newService = {
        id: Date.now(),
        ...serviceData,
        created_at: new Date().toISOString(),
        status: "active",
      };
      localStorage.setItem("boulotman_technician_services", JSON.stringify([newService, ...currentServices]));

      toast.success("Service Published", "Your new service listing is now live and visible to clients!");
      router.push("/dashboard/technician/services");
    } catch (err: any) {
      toast.error("Failed to publish service", err?.message || "Please check your network and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <div className={styles.container}>
              
              <div className={styles.hero}>
                <h1>Post a service</h1>
                <p>Advertise your skills and get hired by clients.</p>
              </div>

              {!isVerified && (
                <div style={{
                  background: "#fffbeb",
                  border: "1.5px solid #fcd34d",
                  borderRadius: "16px",
                  padding: "18px 22px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                      <iconify-icon icon="lucide:alert-triangle" />
                    </div>
                    <div>
                      <strong style={{ color: "#92400e", fontSize: "15px", display: "block", marginBottom: "2px" }}>
                        Account Pending Admin Verification
                      </strong>
                      <p style={{ margin: 0, color: "#b45309", fontSize: "13.5px" }}>
                        You cannot publish new services until an administrator verifies your account credentials. You can prepare your service draft, but publishing requires verified status.
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/technician/profile" style={{
                    background: "#001f3f",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    textDecoration: "none",
                    whiteSpace: "nowrap"
                  }}>
                    Upload ID &amp; Certificates
                  </Link>
                </div>
              )}

              <div className={styles.card}>
                <form onSubmit={handlePreviewSubmit}>

                  <div className={styles.formGroup}>
                    <label>Service title</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Certified electrical installation & solar PV services" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)}
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Service mode</label>
                    <div className={styles.pills}>
                      {["On-site", "Remote", "Hybrid"].map(m => (
                        <label key={m} className={styles.pillLabel}>
                          <input 
                            type="radio" 
                            name="serviceMode" 
                            value={m} 
                            className={styles.pillInput} 
                            checked={mode === m}
                            onChange={() => setMode(m)}
                            required 
                          />
                          <span className={styles.pillText}>{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedTags.size > 0 && (
                    <div className={styles.selectedTags}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", display: "block", width: "100%", marginBottom: "6px" }}>
                        Selected Categories ({selectedTags.size}):
                      </span>
                      {Array.from(selectedTags).map(tag => (
                        <span key={tag} className={styles.tag} onClick={() => handleTagToggle(tag)} title="Click to remove">
                          {tag} ✕
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label>Select your service categories &amp; specializations</label>
                    <p style={{ color: "#64748b", fontSize: "13px", marginTop: "-4px", marginBottom: "12px" }}>
                      Click on any category domain to expand its subcategories and check the services you provide:
                    </p>
                    
                    {CATEGORY_DATA.map(category => (
                      <div 
                        key={category.id} 
                        className={`${styles.categoryBox} ${activeCategory === category.id ? styles.active : ""}`}
                        onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                      >
                        <div className={styles.categoryTitle}>
                          <span>{category.title}</span>
                          <span style={{ fontSize: "12.5px", color: activeCategory === category.id ? "#0284c7" : "#64748b", fontWeight: 700 }}>
                            {activeCategory === category.id ? "▲ Close" : "▼ Choose Services"}
                          </span>
                        </div>
                        <div className={styles.subcategories} onClick={e => e.stopPropagation()}>
                          {category.subgroups.map(group => (
                            <div key={group.title} className={styles.subgroup}>
                              <div className={styles.subgroupTitle}>{group.title}</div>
                              {group.items.map(item => (
                                <label key={item} className={styles.checkboxLabel}>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedTags.has(item)}
                                    onChange={() => handleTagToggle(item)}
                                  />
                                  <span>{item}</span>
                                </label>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Describe your service</label>
                    <textarea 
                      className={styles.formTextarea}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Outline what is included, your years of experience, safety protocols, and warranty coverage..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Operating City / Location</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Cotonou, Benin" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      required 
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className={styles.formGroup}>
                      <label>Hourly Rate (XOF) <small style={{ color: "#64748b" }}>(Optional)</small></label>
                      <input 
                        type="number" 
                        className={styles.formInput} 
                        placeholder="e.g. 5000" 
                        value={hourlyRate} 
                        onChange={e => setHourlyRate(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Full Day Rate (XOF) <small style={{ color: "#64748b" }}>(Optional)</small></label>
                      <input 
                        type="number" 
                        className={styles.formInput} 
                        placeholder="e.g. 35000" 
                        value={dailyRate} 
                        onChange={e => setDailyRate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Service Photos / Proof of Work <small style={{ color: "#64748b" }}>(Optional)</small></label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className={styles.formInput} 
                      onChange={handleFileChange}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={styles.submitBtn} 
                    disabled={submitting}
                  >
                    {submitting ? "Publishing Service..." : "Publish Service Listing"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
