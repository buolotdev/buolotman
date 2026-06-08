"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { formatXOF } from "@/app/lib/format";

type NavKey = "dashboard" | "tasks" | "messages" | "payments" | "saved" | "profile";
type ServiceType = "onsite" | "remote" | "hybrid";
type Urgency = "urgent" | "standard";
type BudgetMode = "fixed" | "hourly";
type ContactMethod = "in-app" | "phone" | "whatsapp";

const navItems: Array<{ key: NavKey; label: string; icon: string; href: string }> = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client" },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client" },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client" },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client" },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/client" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_SKILLS: any[] = [];

export default function PostTaskPage() {
  const router = useRouter();
  const { data: meData } = useFetch(() => api.getMe(), []);
  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    () => api.getCategories(),
    []
  );

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>("onsite");
  const [urgency, setUrgency] = useState<Urgency>("standard");
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("fixed");
  const [materialsProvided, setMaterialsProvided] = useState(false);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>(["in-app"]);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    address: "",
    apartment: "",
    city: "",
    expectedDate: "",
    timePreference: "",
    budget: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [files, setFiles] = useState<Array<{ name: string; size: string; kind: string }>>([]);

  const categories = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (categoriesData ?? []).map((c: any) => ({
        name: c.name || c.title || c.slug,
        slug: c.slug || (c.name || "").toString().toLowerCase(),
        id: c.id,
      })),
    [categoriesData]
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number | null>(null);
  const { data: skillsData, loading: skillsLoading } = useFetch(
    () =>
      selectedCategoryId != null
        ? api.getSkills(String(selectedCategoryId))
        : Promise.resolve(EMPTY_SKILLS),
    [selectedCategoryId]
  );
  const subcategories = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (skillsData ?? []).map((s: any) => ({
        name: s.name || s.title || "",
        id: s.id,
      })),
    [skillsData]
  );

  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      const first = categories[0];
      setFormData((current) => ({ ...current, category: String(first.id), subcategory: "" }));
      setSelectedCategoryId(first.id);
    }
  }, [categories, formData.category]);

  const selectedCategoryName = useMemo(() => {
    return categories.find((c) => String(c.id) === formData.category)?.name || formData.category || "—";
  }, [categories, formData.category]);

  const taskSummary = useMemo(
    () => ({
      categoryLabel: formData.subcategory
        ? `${selectedCategoryName} / ${formData.subcategory}`
        : selectedCategoryName,
      scheduleLabel: formData.expectedDate
        ? `${formData.expectedDate}${formData.timePreference ? ` • ${formData.timePreference}` : ""}`
        : "Not scheduled",
      budgetLabel: formData.budget
        ? budgetMode === "fixed"
          ? `${formatXOF(formData.budget)} fixed`
          : `${formatXOF(formData.budget)} / hr`
        : "—",
      contactLabel: contactMethods.length ? contactMethods.join(", ") : "No contact methods selected",
    }),
    [budgetMode, contactMethods, formData, selectedCategoryName]
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const onCategoryChange = (value: string) => {
    const match = categories.find((c) => String(c.id) === value);
    setFormData((current) => ({ ...current, category: value, subcategory: "" }));
    setSelectedCategoryId(match?.id ?? null);
  };

  const toggleContactMethod = (method: ContactMethod) => {
    setContactMethods((current) =>
      current.includes(method) ? current.filter((item) => item !== method) : [...current, method]
    );
  };

  const addSkill = () => {
    const next = skillInput.trim();
    if (!next || skills.includes(next)) return;
    setSkills((current) => [...current, next]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((current) => current.filter((item) => item !== skill));
  };

  const removeFile = (name: string) => {
    setFiles((current) => current.filter((file) => file.name !== name));
  };

  const saveDraft = () => {
    const payload = {
      title: formData.title,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      expectedDate: formData.expectedDate,
      timePreference: formData.timePreference,
      budget: formData.budget,
      budgetMode,
      urgency,
      serviceType,
      contactMethods,
      materialsProvided,
      skills,
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem("boulotman_post_task_draft", JSON.stringify(payload));
    }
    setSaved(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const draftPayload = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        expectedDate: formData.expectedDate,
        timePreference: formData.timePreference,
        budget: formData.budget,
        budgetMode,
        urgency,
        serviceType,
        contactMethods,
        materialsProvided,
        skills,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("boulotman_post_task_draft", JSON.stringify(draftPayload));
      }

      router.push("/post-task/review");
    } catch (e) {
      setSubmitError((e as Error)?.message || "Failed to continue");
    } finally {
      setSubmitting(false);
    }
  };

  const userInitials = (() => {
    const first = meData?.first_name || "";
    const last = meData?.last_name || "";
    if (first || last) return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
    return "";
  })();
  const userName =
    [meData?.first_name, meData?.last_name].filter(Boolean).join(" ") || meData?.username || "";
  const userRole = meData?.role ? meData.role.charAt(0).toUpperCase() + meData.role.slice(1) : "";

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h1 className={styles.sidebarTitle}>Client Space</h1>
            </div>
            <button
              type="button"
              className={styles.sidebarClose}
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className={styles.navItem}>
                <iconify-icon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button
                type="button"
                className={styles.mobileMenuButton}
                aria-label="Open navigation"
                onClick={() => setMobileNavOpen(true)}
              >
                <iconify-icon icon="lucide:menu" />
              </button>

              <label className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="search" placeholder="Search tasks, professionals..." aria-label="Search tasks and professionals" />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>

              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>{userInitials}</div>
                <div>
                  <p className={styles.userName}>{userName}</p>
                  <p className={styles.userRole}>{userRole}</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <div className={styles.contentInner}>
              <section className={styles.pageHeader}>
                <div>
                  <h2>Post a Task</h2>
                  <p>Provide detailed information to find the best professional for your job.</p>
                </div>

                <div className={styles.stepper} aria-label="Task publishing progress">
                  <div className={`${styles.step} ${styles.stepActive}`}>
                    <span className={styles.stepNumber}>1</span>
                    <span className={styles.stepText}>Draft</span>
                  </div>
                  <span className={styles.stepLine} />
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>2</span>
                    <span className={styles.stepText}>Preview</span>
                  </div>
                  <span className={styles.stepLine} />
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>3</span>
                    <span className={styles.stepText}>Publish</span>
                  </div>
                </div>
              </section>

              {saved ? (
                <section className={`${styles.banner} ${styles.bannerDraft}`}>
                  <div>
                    <strong>Draft saved</strong>
                    <p>Your draft is saved locally so you can keep editing before publishing.</p>
                  </div>
                  <Link href="/dashboard/client" className={styles.bannerLink}>
                    Back to dashboard
                  </Link>
                </section>
              ) : null}

              {submitError ? (
                <section className={`${styles.banner} ${styles.bannerDraft}`} style={{ borderColor: "#ef4444" }}>
                  <div>
                    <strong>Could not publish task</strong>
                    <p>{submitError}</p>
                  </div>
                </section>
              ) : null}

              <form className={styles.twoColumnLayout} onSubmit={handleSubmit}>
                <div className={styles.mainColumn}>
                  <section className={styles.card}>
                    <div className={styles.sectionTitle}>
                      <h3>Task Overview</h3>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroupFull}>
                        <label htmlFor="title" className={styles.label}>Task Title</label>
                        <input
                          id="title"
                          className={styles.input}
                          value={formData.title}
                          onChange={(event) => updateField("title", event.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.label}>Category</label>
                        <select
                          id="category"
                          className={styles.select}
                          value={formData.category}
                          onChange={(event) => onCategoryChange(event.target.value)}
                          required
                        >
                          {categoriesLoading ? (
                            <option>Loading…</option>
                          ) : categories.length === 0 ? (
                            <option value="">No categories</option>
                          ) : (
                            categories.map((category) => (
                              <option key={String(category.id)} value={String(category.id)}>{category.name}</option>
                            ))
                          )}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="subcategory" className={styles.label}>Sub-Category</label>
                        <select
                          id="subcategory"
                          className={styles.select}
                          value={formData.subcategory}
                          onChange={(event) => updateField("subcategory", event.target.value)}
                        >
                          {skillsLoading ? (
                            <option>Loading…</option>
                          ) : subcategories.length === 0 ? (
                            <option value="">No subcategories</option>
                          ) : (
                            subcategories.map((sub) => (
                              <option key={String(sub.id)} value={sub.name}>{sub.name}</option>
                            ))
                          )}
                        </select>
                      </div>

                      <div className={styles.formGroupFull}>
                        <label htmlFor="description" className={styles.label}>Description</label>
                        <textarea
                          id="description"
                          className={styles.textarea}
                          value={formData.description}
                          onChange={(event) => updateField("description", event.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.formGroupFull}>
                        <label htmlFor="skill-input" className={styles.label}>Specific Skills Required (Optional)</label>
                        <div className={styles.inlineInputRow}>
                          <input
                            id="skill-input"
                            className={styles.input}
                            placeholder="e.g. Panel Installation"
                            value={skillInput}
                            onChange={(event) => setSkillInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addSkill();
                              }
                            }}
                          />
                          <button type="button" className={styles.secondaryButton} onClick={addSkill}>Add</button>
                        </div>

                        <div className={styles.tagRow}>
                          {skills.map((skill) => (
                            <span key={skill} className={styles.tag}>
                              {skill}
                              <button type="button" className={styles.tagRemove} onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                                <iconify-icon icon="lucide:x" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={styles.card}>
                    <div className={styles.sectionTitle}>
                      <h3>Location Details</h3>
                    </div>

                    <div className={styles.mapPreview}>
                      <div className={styles.mapPin}>
                        <iconify-icon icon="lucide:map-pin" />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroupFull}>
                        <label htmlFor="address" className={styles.label}>Street Address</label>
                        <input id="address" className={styles.input} value={formData.address} onChange={(event) => updateField("address", event.target.value)} required />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="apartment" className={styles.label}>Apartment, suite, etc. (Optional)</label>
                        <input id="apartment" className={styles.input} value={formData.apartment} onChange={(event) => updateField("apartment", event.target.value)} />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="city" className={styles.label}>City</label>
                        <input id="city" className={styles.input} value={formData.city} onChange={(event) => updateField("city", event.target.value)} required />
                      </div>
                    </div>
                  </section>

                  <section className={styles.card}>
                    <div className={styles.sectionTitle}>
                      <h3>Media & Attachments</h3>
                      <span>(Optional)</span>
                    </div>

                    <button type="button" className={styles.uploadZone}>
                      <div className={styles.uploadIcon}>
                        <iconify-icon icon="lucide:upload-cloud" />
                      </div>
                      <strong>Click to upload or drag and drop</strong>
                      <span>SVG, PNG, JPG or PDF (max. 10MB)</span>
                    </button>

                    <div className={styles.fileList}>
                      {files.map((file) => (
                        <div key={file.name} className={styles.fileItem}>
                          <div className={styles.fileIcon}>
                            <iconify-icon icon={file.kind === "pdf" ? "lucide:file-text" : "lucide:image"} />
                          </div>
                          <div className={styles.fileInfo}>
                            <strong>{file.name}</strong>
                            <span>{file.size}</span>
                          </div>
                          <button type="button" className={styles.fileRemove} onClick={() => removeFile(file.name)} aria-label={`Remove ${file.name}`}>
                            <iconify-icon icon="lucide:trash-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className={styles.sidePanel}>
                  <section className={styles.card}>
                    <div className={styles.sectionTitle}>
                      <h3>Task Setup</h3>
                    </div>

                    <div className={styles.stack}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Service Type</label>
                        <div className={styles.segmentedControl}>
                          {[
                            { value: "onsite", label: "Onsite" },
                            { value: "remote", label: "Remote" },
                            { value: "hybrid", label: "Hybrid" },
                          ].map((option) => (
                            <button key={option.value} type="button" className={`${styles.segment} ${serviceType === option.value ? styles.segmentActive : ""}`} onClick={() => setServiceType(option.value as ServiceType)}>
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.divider} />

                      <div className={styles.formGroup}>
                        <label htmlFor="expectedDate" className={styles.label}>Expected Date</label>
                        <input id="expectedDate" type="date" className={styles.input} value={formData.expectedDate} onChange={(event) => updateField("expectedDate", event.target.value)} />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="timePreference" className={styles.label}>Time Preference</label>
                        <input id="timePreference" className={styles.input} placeholder="e.g. Morning" value={formData.timePreference} onChange={(event) => updateField("timePreference", event.target.value)} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Urgency Level</label>
                        <div className={styles.stackCompact}>
                          {[
                            { value: "urgent", label: "Urgent (Within 24h)" },
                            { value: "standard", label: "Standard / Flexible" },
                          ].map((option) => (
                            <button key={option.value} type="button" className={`${styles.radioCard} ${urgency === option.value ? styles.radioCardActive : ""}`} onClick={() => setUrgency(option.value as Urgency)}>
                              <span className={styles.radioIndicator} />
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.divider} />

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Budget Options</label>
                        <div className={styles.segmentedControl}>
                          {[
                            { value: "fixed", label: "Fixed Price" },
                            { value: "hourly", label: "Hourly Rate" },
                          ].map((option) => (
                            <button key={option.value} type="button" className={`${styles.segment} ${budgetMode === option.value ? styles.segmentActive : ""}`} onClick={() => setBudgetMode(option.value as BudgetMode)}>
                              {option.label}
                            </button>
                          ))}
                        </div>
                        <div className={styles.currencyInput}>
                          <span>XOF</span>
                          <input
                            type="number"
                            value={formData.budget}
                            onChange={(event) => updateField("budget", event.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={styles.card}>
                    <div className={styles.sectionTitle}>
                      <h3>Preferences</h3>
                    </div>

                    <div className={styles.stack}>
                      <div className={styles.toggleRow}>
                        <div>
                          <strong>Materials Provided</strong>
                          <span>Client provides materials</span>
                        </div>
                        <button type="button" className={`${styles.toggle} ${materialsProvided ? styles.toggleOn : ""}`} onClick={() => setMaterialsProvided((current) => !current)} aria-pressed={materialsProvided}>
                          <span />
                        </button>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Contact Method</label>
                        <div className={styles.stackCompact}>
                          {[
                            { value: "in-app", label: "In-app Messaging" },
                            { value: "phone", label: "Phone Call" },
                            { value: "whatsapp", label: "WhatsApp" },
                          ].map((option) => {
                            const checked = contactMethods.includes(option.value as ContactMethod);

                            return (
                              <button key={option.value} type="button" className={styles.checkboxRow} onClick={() => toggleContactMethod(option.value as ContactMethod)}>
                                <span className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ""}`}>
                                  {checked ? <iconify-icon icon="lucide:check" /> : null}
                                </span>
                                <span>{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={`${styles.card} ${styles.summaryCard}`}>
                    <div className={styles.sectionTitle}>
                      <h3>Task Summary</h3>
                    </div>

                    <div className={styles.summaryList}>
                      <div>
                        <span>Category</span>
                        <strong>{taskSummary.categoryLabel}</strong>
                      </div>
                      <div>
                        <span>Schedule</span>
                        <strong>{taskSummary.scheduleLabel}</strong>
                      </div>
                      <div>
                        <span>Budget</span>
                        <strong>{taskSummary.budgetLabel}</strong>
                      </div>
                      <div>
                        <span>Contact</span>
                        <strong>{taskSummary.contactLabel}</strong>
                      </div>
                    </div>

                    <div className={styles.actionStack}>
                      <button type="submit" className={styles.primaryButtonBlock} disabled={submitting}>
                        {submitting ? "Publishing…" : "Review & Publish"}
                      </button>
                      <button type="button" className={styles.secondaryButtonBlock} onClick={saveDraft}>Save as Draft</button>
                    </div>
                  </section>
                </aside>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
