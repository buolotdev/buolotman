"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import styles from "./page.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { formatXOF } from "@/app/lib/format";
import { useTaskDraft } from "./TaskDraftContext";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

type ServiceType = "onsite" | "remote" | "hybrid";
type Urgency = "urgent" | "standard";
type BudgetMode = "fixed" | "hourly";
type PaymentOption = "" | "Cash on completion" | "Milestone payment" | "Escrow";
type ContactMethod = "in-app" | "phone" | "whatsapp";

import { toArray } from "@/app/lib/dataShape";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_SKILLS: any[] = [];

function PostTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCompanyId = searchParams.get("invite_company");
  const inviteSpecialistId = searchParams.get("invite");

  const [authState, setAuthState] = useState<"checking" | "authed" | "guest">("checking");
  const { data: meData } = useFetch(
    () => (authState === "authed" ? api.getMe() : Promise.resolve(null)),
    [authState]
  );
  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    () => api.getCategories(),
    []
  );

  const { data: invitedCompany } = useFetch<any>(
    () => (inviteCompanyId ? api.getCompanyPublicProfile(Number(inviteCompanyId)) : Promise.resolve(null)),
    [inviteCompanyId]
  );
  const { data: invitedSpecialist } = useFetch<any>(
    () => (inviteSpecialistId ? api.getUserProfile(Number(inviteSpecialistId)) : Promise.resolve(null)),
    [inviteSpecialistId]
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

  const { files, setFiles } = useTaskDraft();
  const [previewMedia, setPreviewMedia] = useState<any | null>(null);

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
    budgetMin: "",
    budgetMax: "",
    paymentOption: "" as PaymentOption,
  });
  const [skills, setSkills] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = await Promise.all(
      Array.from(e.target.files).map(async (file) => {
        const kind = file.type === "application/pdf" ? "pdf" : "image";
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        return {
          name: file.name,
          size: file.size,
          sizeFormatted: (file.size / 1024 / 1024).toFixed(2) + " MB",
          kind,
          type: file.type,
          base64,
        };
      })
    );
    setFiles((current: any) => [...current, ...newFiles]);
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      setAuthState("guest");
      router.replace("/login?next=%2Fpost-task");
      return;
    }

    setAuthState("authed");
  }, [router]);

  const categories = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toArray(categoriesData ?? []).map((c: any) => ({
        name: c.name || c.title || c.slug,
        slug: c.slug || (c.name || "").toString().toLowerCase(),
        id: c.id,
      })),
    [categoriesData]
  );

  // Auto-detect location on mount
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.city) {
          setFormData((current) => ({
            ...current,
            city: `${data.city}, ${data.country_name || ""}`.trim(),
          }));
        }
      })
      .catch(() => {
        // silently ignore
      });
  }, []);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number | null>(null);
  const { data: skillsData, loading: skillsLoading } = useFetch(
    () =>
      selectedCategoryId != null
        ? api.getSkills(String(selectedCategoryId))
        : Promise.resolve(EMPTY_SKILLS),
    [selectedCategoryId]
  );
  const selectedCategoryName = useMemo(() => {
    return categories.find((c) => String(c.id) === formData.category)?.name || formData.category || "—";
  }, [categories, formData.category]);

  const subcategories = useMemo(() => {
    return toArray(skillsData ?? []).map((s: any) => ({
      name: s.name || s.title || "",
      id: s.id,
    }));
  }, [skillsData]);

  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      const first = categories[0];
      setFormData((current) => ({ ...current, category: String(first.id), subcategory: "" }));
      setSelectedCategoryId(first.id);
    }
  }, [categories, formData.category]);

  const taskSummary = useMemo(
    () => ({
      categoryLabel: formData.subcategory
        ? `${selectedCategoryName} / ${formData.subcategory}`
        : selectedCategoryName,
      scheduleLabel: formData.expectedDate
        ? `${formData.expectedDate}${formData.timePreference ? ` • ${formData.timePreference}` : ""}`
        : "Not scheduled",
      budgetLabel: formData.budgetMin || formData.budgetMax
        ? `${formData.budgetMin ? formatXOF(formData.budgetMin) : "0"} - ${formData.budgetMax ? formatXOF(formData.budgetMax) : "Max"}`
        : "—",
      contactLabel: contactMethods.length ? contactMethods.join(", ") : "No contact methods selected",
    }),
    [contactMethods, formData, selectedCategoryName]
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
      budgetMin: formData.budgetMin,
      budgetMax: formData.budgetMax,
      paymentOption: formData.paymentOption,
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
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        paymentOption: formData.paymentOption,
        urgency,
        serviceType,
        contactMethods,
        materialsProvided,
        skills,
        inviteCompanyId: inviteCompanyId || null,
        inviteSpecialistId: inviteSpecialistId || null,
        inviteCompanyName: invitedCompany?.company_name || null,
        inviteSpecialistName: invitedSpecialist ? `${invitedSpecialist.first_name || ""} ${invitedSpecialist.last_name || ""}`.trim() || invitedSpecialist.username : null,
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

  if (authState !== "authed") {
    return (
      <main className={styles.page} style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div style={{ color: "#001f3f", fontWeight: 700 }}>Redirecting to login...</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tasks, professionals..."
          />

          <div className={styles.content}>

            <div className={styles.contentInner}>
              <section className={styles.pageHeader}>
                <div>
                  <h2>{inviteCompanyId ? "Request Enterprise Quotation" : inviteSpecialistId ? "Direct Task Assignment" : "Post a Task"}</h2>
                  <p>
                    {inviteCompanyId
                      ? `Fill out your project specifications to request a formal quotation from ${invitedCompany?.company_name || "the enterprise"}.`
                      : inviteSpecialistId
                      ? `Assign this task directly to ${invitedSpecialist?.first_name || "the selected specialist"}.`
                      : "Provide detailed information to find the best professional for your job."}
                  </p>
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

              {meData && !meData.is_verified && (
                <div style={{ padding: "16px 20px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#d97706", flexShrink: 0 }}>
                    <iconify-icon icon="lucide:shield-alert"></iconify-icon>
                  </div>
                  <div>
                    <strong style={{ color: "#92400e", fontSize: 14, display: "block", marginBottom: 2 }}>Account Verification Notice</strong>
                    <span style={{ color: "#b45309", fontSize: 13 }}>Your account is currently under review by Admin. You can draft your project specifications, and it will be published once verified by Admin.</span>
                  </div>
                </div>
              )}

              {inviteCompanyId && (

                <div style={{ padding: "18px 22px", background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)", borderRadius: 18, color: "#fff", display: "flex", alignItems: "center", gap: 14, marginBottom: 24, boxShadow: "0 10px 25px rgba(0, 31, 63, 0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", flexShrink: 0 }}>
                    <iconify-icon icon="lucide:building-2"></iconify-icon>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff8c42" }}>Enterprise Quote Request</div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>Requesting quotation from {invitedCompany?.company_name || "Selected Company"}</h3>
                  </div>
                </div>
              )}

              {inviteSpecialistId && (
                <div style={{ padding: "18px 22px", background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)", borderRadius: 18, color: "#fff", display: "flex", alignItems: "center", gap: 14, marginBottom: 24, boxShadow: "0 10px 25px rgba(0, 31, 63, 0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", flexShrink: 0 }}>
                    <iconify-icon icon="lucide:user-check"></iconify-icon>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff8c42" }}>Direct Specialist Assignment</div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>Directly inviting {invitedSpecialist ? `${invitedSpecialist.first_name || ""} ${invitedSpecialist.last_name || ""}`.trim() || invitedSpecialist.username : "Technician"}</h3>
                  </div>
                </div>
              )}

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
                          placeholder="e.g. Need a professional electrician for panel installation"
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
                        {selectedCategoryName === "Other" || (!skillsLoading && subcategories.length === 0) ? (
                          <input
                            id="subcategory"
                            type="text"
                            className={styles.input}
                            placeholder="e.g. specialized task"
                            value={formData.subcategory}
                            onChange={(event) => updateField("subcategory", event.target.value)}
                          />
                        ) : (
                          <select
                            id="subcategory"
                            className={styles.select}
                            value={formData.subcategory}
                            onChange={(event) => updateField("subcategory", event.target.value)}
                          >
                            {skillsLoading ? (
                              <option>Loading…</option>
                            ) : (
                              <>
                                <option value="" disabled>Select a sub-category</option>
                                {subcategories.map((sub) => (
                                  <option key={String(sub.id)} value={sub.name}>{sub.name}</option>
                                ))}
                              </>
                            )}
                          </select>
                        )}
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
                            placeholder="e.g. Panel Installation, Python, React..."
                            value={skillInput}
                            onChange={(event) => setSkillInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addSkill();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className={styles.addSkillBtn}
                            onClick={addSkill}
                            id="add-skill-btn"
                          >
                            <iconify-icon icon="lucide:plus" style={{ fontSize: 18 }} />
                            <span>Add</span>
                          </button>
                        </div>

                        <div className={styles.tagRow}>
                          {skills.map((skill) => (
                            <span key={skill} className={styles.tag}>
                              <iconify-icon icon="lucide:check" style={{ color: "#16a34a", fontSize: 13 }} />
                              {skill}
                              <button type="button" className={styles.tagRemove} onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                                <iconify-icon icon="lucide:x" style={{ fontSize: 13 }} />
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

                    <div className={styles.mapPreview} style={{ padding: 0, overflow: 'hidden' }}>
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address ? `${formData.address}, ${formData.city}` : formData.city || 'Africa')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        style={{ border: 0, minHeight: '200px' }}
                      ></iframe>
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

                    <button type="button" className={styles.uploadZone} onClick={() => fileInputRef?.current?.click()}>
                      <div className={styles.uploadIcon}>
                        <iconify-icon icon="lucide:upload-cloud" />
                      </div>
                      <strong>Click to upload or drag and drop</strong>
                      <span>SVG, PNG, JPG or PDF (max. 10MB)</span>
                    </button>
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/svg+xml, application/pdf"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />

                    <div className={styles.fileList}>
                      {files.map((file: any) => (
                        <div
                          key={file.name}
                          className={styles.fileItem}
                          onClick={() => setPreviewMedia(file)}
                          title="Click to view & expand"
                        >
                          <div className={styles.fileIconWrap}>
                            {file.kind === "image" && file.base64 ? (
                              <img src={file.base64} alt={file.name} className={styles.fileThumbnail} />
                            ) : (
                              <div className={styles.fileIcon}>
                                <iconify-icon icon={file.kind === "pdf" ? "lucide:file-text" : "lucide:image"} />
                              </div>
                            )}
                          </div>

                          <div className={styles.fileInfo}>
                            <div className={styles.fileNameRow}>
                              <strong>{file.name}</strong>
                              <span className={styles.previewHint}>
                                <iconify-icon icon="lucide:maximize-2" /> Click to expand
                              </span>
                            </div>
                            <span>{file.sizeFormatted || (file.size / 1024 / 1024).toFixed(2) + " MB"}</span>
                          </div>

                          <div className={styles.fileActions}>
                            <button
                              type="button"
                              className={styles.filePreviewBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewMedia(file);
                              }}
                              title="Preview"
                            >
                              <iconify-icon icon="lucide:eye" />
                            </button>
                            <button
                              type="button"
                              className={styles.fileRemove}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFiles(files.filter((f: any) => f.name !== file.name));
                              }}
                              aria-label={`Remove ${file.name}`}
                              title="Remove file"
                            >
                              <iconify-icon icon="lucide:trash-2" />
                            </button>
                          </div>
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
                            { value: "urgent", label: "Urgent" },
                            { value: "standard", label: "Standard / Flexible" },
                          ].map((option) => (
                            <button key={option.value} type="button" className={`${styles.radioCard} ${urgency === option.value ? styles.radioCardActive : ""}`} onClick={() => setUrgency(option.value as any)}>
                              <span className={styles.radioIndicator} />
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.divider} />

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Budget Range (XOF)</label>
                        <div className={styles.inlineInputRow}>
                          <input
                            type="number"
                            className={styles.input}
                            value={formData.budgetMin}
                            onChange={(event) => updateField("budgetMin", event.target.value)}
                            placeholder="Minimum"
                          />
                          <input
                            type="number"
                            className={styles.input}
                            value={formData.budgetMax}
                            onChange={(event) => updateField("budgetMax", event.target.value)}
                            placeholder="Maximum"
                          />
                        </div>
                      </div>

                      <div className={styles.divider} />

                      <div className={styles.formGroup}>
                        <label htmlFor="paymentOption" className={styles.label}>Preferred Payment Option</label>
                        <select
                          id="paymentOption"
                          className={styles.select}
                          value={formData.paymentOption}
                          onChange={(event) => updateField("paymentOption", event.target.value)}
                          required
                        >
                          <option value="">Choose payment option</option>
                          <option value="Cash on completion">Cash on completion</option>
                          <option value="Milestone payment">Milestone payment</option>
                          <option value="Escrow">Escrow (recommended)</option>
                        </select>
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

      {/* LIGHTBOX MEDIA EXPAND MODAL */}
      {previewMedia && (
        <div className={styles.lightboxOverlay} onClick={() => setPreviewMedia(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <div className={styles.lightboxTitleWrap}>
                <iconify-icon
                  icon={previewMedia.kind === "pdf" ? "lucide:file-text" : "lucide:image"}
                  style={{ color: "#ff4500", fontSize: 24 }}
                />
                <div>
                  <h4>{previewMedia.name}</h4>
                  <span>{previewMedia.sizeFormatted || (previewMedia.size / 1024 / 1024).toFixed(2) + " MB"}</span>
                </div>
              </div>
              <div className={styles.lightboxHeaderActions}>
                {previewMedia.base64 && (
                  <a
                    href={previewMedia.base64}
                    download={previewMedia.name}
                    className={styles.lightboxDownloadBtn}
                    title="Download file"
                  >
                    <iconify-icon icon="lucide:download" />
                    <span>Download</span>
                  </a>
                )}
                <button
                  type="button"
                  className={styles.lightboxCloseBtn}
                  onClick={() => setPreviewMedia(null)}
                  title="Close Preview (Esc)"
                >
                  <iconify-icon icon="lucide:x" />
                </button>
              </div>
            </div>

            <div className={styles.lightboxBody}>
              {previewMedia.kind === "pdf" ? (
                <div className={styles.pdfPreviewBox}>
                  <iconify-icon icon="lucide:file-text" style={{ fontSize: 72, color: "#ff4500" }} />
                  <p>PDF Document: <strong>{previewMedia.name}</strong></p>
                  <a
                    href={previewMedia.base64}
                    download={previewMedia.name}
                    className={styles.pdfDownloadCta}
                  >
                    <iconify-icon icon="lucide:download" /> Open / Download PDF Document
                  </a>
                </div>
              ) : (
                <img
                  src={previewMedia.base64}
                  alt={previewMedia.name}
                  className={styles.expandedImg}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PostTaskPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#001f3f", fontWeight: 700 }}>Loading task form...</div>}>
      <PostTaskForm />
    </Suspense>
  );
}

