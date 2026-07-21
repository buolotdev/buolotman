"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/Toast";
import LogoutButton from "@/app/components/LogoutButton";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import styles from "./page.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";

const CATEGORY_DATA = [
  {
    id: "eng_tech",
    title: "I. Engineering & Technology Services",
    subgroups: [
      {
        title: "1. Software & Digital Engineering",
        items: [
          "Web application development",
          "Mobile application development (Android / iOS)",
          "Back-end systems & API development",
          "DevOps & cloud deployment",
          "Database design & optimization",
          "ERP & CRM system implementation",
          "Software maintenance & upgrades",
          "UI/UX design engineering",
          "QA testing & automation",
          "Legacy system modernization",
        ]
      },
      {
        title: "2. IT Infrastructure & Networking",
        items: [
          "Network design & installation",
          "LAN/WAN configuration",
          "Server setup & management",
          "Data center deployment",
          "Firewall & routing configuration",
          "Wireless network optimization",
          "Network security audits",
          "IT infrastructure maintenance",
        ]
      },
      {
        title: "3. Cybersecurity Services",
        items: [
          "Security risk assessments",
          "Penetration testing",
          "System hardening",
          "SOC setup & monitoring",
          "Data protection & encryption",
          "Incident response & recovery",
          "Compliance (ISO 27001, GDPR readiness)",
        ]
      },
      {
        title: "4. Cloud & Systems Engineering",
        items: [
          "Cloud migration (AWS, Azure, GCP)",
          "Virtualization (VMware, Proxmox)",
          "Backup & disaster recovery systems",
          "Cloud cost optimization",
          "Hybrid infrastructure design",
        ]
      }
    ]
  },
  {
    id: "elec_eng",
    title: "B. Electrical & Electronics Engineering",
    subgroups: [
      {
        title: "5. Electrical Engineering Services",
        items: [
          "Residential electrical installation",
          "Commercial electrical systems",
          "Industrial electrical wiring",
          "Power distribution systems",
          "Generator installation & servicing",
          "Solar PV system design & installation",
          "Inverter & battery systems",
          "Earthing & surge protection",
          "Electrical safety inspections",
        ]
      },
      {
        title: "6. Electronics & Embedded Systems",
        items: [
          "CCTV & surveillance systems",
          "Access control & biometric systems",
          "Fire alarm systems",
          "Smart home systems",
          "IoT device deployment",
          "Electronics repair & diagnostics",
        ]
      }
    ]
  },
  {
    id: "mech_civil",
    title: "C. Mechanical, Civil & Industrial Services",
    subgroups: [
      {
        title: "7. Mechanical Engineering",
        items: [
          "HVAC installation & servicing",
          "Industrial machinery maintenance",
          "Pumps & motors installation",
          "Welding & fabrication",
          "Mechanical system diagnostics",
        ]
      },
      {
        title: "8. Civil & Construction Engineering",
        items: [
          "Structural design & supervision",
          "Building construction management",
          "Renovation & remodeling",
          "Road & drainage works",
          "Quantity surveying",
          "Site inspection & reporting",
        ]
      },
      {
        title: "9. Renewable Energy & Utilities",
        items: [
          "Solar & wind system installation",
          "Energy audits",
          "Water treatment systems",
          "Borehole drilling supervision",
          "Utility infrastructure maintenance",
        ]
      }
    ]
  },
  {
    id: "specialized",
    title: "D. Specialized Technical Services",
    subgroups: [
      {
        title: "10. Automotive & Heavy Equipment",
        items: [
          "Vehicle diagnostics & repair",
          "Fleet maintenance services",
          "Heavy machinery operation & servicing",
          "Electrical auto systems",
        ]
      },
      {
        title: "11. Telecom & Broadcast",
        items: [
          "Fiber optic installation",
          "Tower installation & maintenance",
          "VSAT systems",
          "Radio & broadcast equipment setup",
        ]
      }
    ]
  },
  {
    id: "handyman",
    title: "II. Handyman Service Categories",
    subgroups: [
      {
        title: "A. Home & Building Maintenance",
        items: [
          "Minor home repairs",
          "Furniture fixing & assembly",
          "Door & window repairs",
          "Lock installation & repair",
          "Curtain & shelf installation",
        ]
      },
      {
        title: "Plumbing Services",
        items: [
          "Leak detection & repair",
          "Pipe installation",
          "Toilet & sink repairs",
          "Water heater installation",
          "Drain cleaning",
        ]
      },
      {
        title: "Electrical (Low-Risk)",
        items: [
          "Light installation",
          "Switch & socket replacement",
          "Fan installation",
          "Appliance wiring",
          "Fault checking",
        ]
      },
      {
        title: "B. Construction & Finishing",
        items: [
          "Masonry & tiling",
          "Carpentry & woodwork",
          "Painting & decoration",
        ]
      },
      {
        title: "C. Cleaning, Care & Domestic Services",
        items: [
          "House cleaning",
          "Office cleaning",
          "Post-construction cleaning",
          "Home aides",
          "Elderly assistance",
          "Childcare support",
          "Errand services",
        ]
      },
      {
        title: "D. Outdoor & Environment Services",
        items: [
          "Landscaping & gardening",
          "Lawn mowing",
          "Tree trimming",
          "Garden design",
          "Irrigation setup",
          "Waste collection",
          "Septic tank cleaning",
          "Pest control",
          "Disinfection services",
        ]
      },
      {
        title: "E. Transport, Logistics & Support",
        items: [
          "Moving & relocation",
          "Furniture transport",
          "Delivery services",
          "Gate keeping",
          "Night watch services",
          "Event support staff",
        ]
      }
    ]
  }
];

export default function TechnicianPostServicePage() {
  const router = useRouter();
  const toast = useToast();
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("On-site");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricingModel, setPricingModel] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        if (d && d.city) {
          setLocation(`${d.city}, ${d.country_name}`);
        }
      })
      .catch(() => {});
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTags.size === 0) {
      toast.error("Error", "Please select at least one service category.");
      return;
    }
    setPreviewOpen(true);
  };

  const saveDraft = () => {
    toast.success("Saved", "Service saved to draft.");
    setPreviewOpen(false);
  };

  const publishService = () => {
    toast.success("Published!", "Your service is now live.");
    router.push("/dashboard/technician/services");
  };

  return (
    <main className={styles.page}>
      <div className={styles.layoutWrapper}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <div className={styles.container}>
              
              <div className={styles.hero}>
                <h1>Post a service</h1>
                <p>Advertise your skills and get hired by clients.</p>
              </div>

              <div className={styles.card}>
                <form onSubmit={handlePreviewSubmit}>

                  <div className={styles.formGroup}>
                    <label>Service title</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Certified electrical installation services" 
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

                  <div className={styles.selectedTags}>
                    {Array.from(selectedTags).map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Select your service categories</label>
                    
                    {CATEGORY_DATA.map(category => (
                      <div 
                        key={category.id} 
                        className={`${styles.categoryBox} ${activeCategory === category.id ? styles.active : ""}`}
                        onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                      >
                        <div className={styles.categoryTitle}>{category.title}</div>
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
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Service location</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      required 
                    />
                    <div className={styles.note}>Detected automatically using your IP. You can edit it.</div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Pricing model</label>
                    <select 
                      className={styles.formSelect}
                      value={pricingModel}
                      onChange={e => setPricingModel(e.target.value)}
                    >
                      <option value="">Select pricing model</option>
                      <option value="Fixed price">Fixed price</option>
                      <option value="Hourly rate">Hourly rate</option>
                      <option value="Daily rate">Daily rate</option>
                      <option value="Negotiable">Negotiable</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Starting price (optional)</label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      placeholder="e.g. 100"
                      value={startingPrice}
                      onChange={e => setStartingPrice(e.target.value)}
                    />
                  </div>

                  <button type="submit" className={styles.primaryBtn}>Preview service</button>
                  <div className={styles.note}>Review before publishing to the Technicians page.</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className={styles.previewOverlay}>
          <div className={styles.previewBox}>
            <h2>Service preview</h2>
            
            <div className={styles.previewGrid}>
              <div className={styles.previewItem}>
                <strong>Title</strong>
                <p>{title}</p>
              </div>
              <div className={styles.previewItem}>
                <strong>Mode</strong>
                <p>{mode || "Not specified"}</p>
              </div>
              <div className={styles.previewItem}>
                <strong>Location</strong>
                <p>{location}</p>
              </div>
              <div className={styles.previewItem}>
                <strong>Pricing</strong>
                <p>{pricingModel || "Negotiable"} {startingPrice ? `- From ${startingPrice}` : ""}</p>
              </div>
            </div>
            
            <div className={styles.previewItem} style={{ marginBottom: 24 }}>
              <strong>Categories</strong>
              <p>{Array.from(selectedTags).join(", ")}</p>
            </div>
            
            <div className={styles.previewItem}>
              <strong>Description</strong>
              <p style={{ whiteSpace: "pre-wrap" }}>{description}</p>
            </div>

            <div className={styles.previewActions}>
              <button className={styles.secondaryBtn} onClick={() => setPreviewOpen(false)}>Edit</button>
              <button className={styles.secondaryBtn} onClick={saveDraft}>Save draft</button>
              <button className={styles.primaryBtn} onClick={publishService}>Publish</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
