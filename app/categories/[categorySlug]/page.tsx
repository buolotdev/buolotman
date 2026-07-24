"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { api } from "../../lib/api";
import { useFetch } from "../../lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "../../components/skeleton/Skeleton";
import { formatXOF } from "../../lib/format";
import styles from "./page.module.css";

const ICON_BY_KEY: Record<string, string> = {
  wiring: "lucide:plug-zap",
  lighting: "lucide:lightbulb",
  solar: "lucide:sun",
  appliance: "lucide:fan",
  security: "lucide:cctv",
  panel: "lucide:panel-left",
  default: "lucide:wrench",
};

const HOW_STEPS = [
  { title: "Post or Search", description: "Describe your job or browse the directory." },
  { title: "Compare Quotes", description: "Review profiles, ratings, and pricing side by side." },
  { title: "Hire Safely", description: "Confirm the booking and pay securely through escrow." },
];

export default function Page({ params }: { params: { categorySlug: string } }) {
  const { categorySlug } = params;
  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    () => api.getCategories(),
    []
  );
  const { data: tasksData, loading: tasksLoading } = useFetch(
    () => api.getTasks({ category: categorySlug }),
    []
  );
  const { data: skillsData, loading: skillsLoading } = useFetch(
    () => api.getSkills(categorySlug),
    []
  );

  const [availability, setAvailability] = useState({ today: false, emergency: false });
  const [type, setType] = useState<"any" | "technician" | "company">("any");
  const [years, setYears] = useState(0);
  const [rating, setRating] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);

  const subcategories = (skillsData ?? []).slice(0, 6).map((s, i) => ({
    title: s.name || s.title || `Skill ${i + 1}`,
    icon: ICON_BY_KEY[(s.name || "").toString().toLowerCase()] || ICON_BY_KEY.default,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const services = ((tasksData?.results ?? tasksData ?? []) as any[]).slice(0, 6).map((t) => ({
    title: t.title || t.name || "Service",
    price: t.budget ?? t.starting_price,
    icon: "lucide:zap",
  }));

  const professionals = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list = (tasksData?.results ?? tasksData ?? []) as any[];
    return list.slice(0, 8).map((p) => ({
      id: p.id,
      name: p.owner_name || p.name || p.user?.first_name || "Professional",
      role: p.role || p.specialty || p.title || "Electrician",
      type: p.type || (p.company_name ? "company" : "technician"),
      rating: Number(p.rating ?? p.average_rating ?? 0),
      reviews: Number(p.reviews ?? p.reviews_count ?? 0),
      location: p.location || p.city || "",
      price: p.price ?? p.hourly_rate ?? p.starting_price,
      priceUnit: p.price_unit || p.unit || "Starting price",
      image: p.image || p.cover_image || p.avatar,
      avatar: p.avatar || p.avatar_url,
      years: Number(p.years_experience ?? p.years ?? 0),
      verified: Boolean(p.verified ?? p.is_verified),
      fastResponder: Boolean(p.fast_responder ?? p.emergency),
      topRated: Boolean(p.top_rated ?? p.is_top_rated),
      emergency: Boolean(p.emergency ?? p.is_emergency),
      availableToday: Boolean(p.available_today),
      hiresLabel:
        p.hires_label ||
        (p.jobs_completed
          ? `${p.jobs_completed}+ Hires`
          : p.team_size
            ? `Team of ${p.team_size}`
            : "New Pro"),
    }));
  }, [tasksData]);

  const filtered = useMemo(
    () =>
      professionals.filter((pro) => {
        if (type !== "any" && pro.type !== type) return false;
        if (pro.rating < rating) return false;
        if (pro.years < years) return false;
        return true;
      }),
    [professionals, type, rating, years]
  );

  const featured = filtered.filter((pro) => pro.type === "technician");
  const companies = filtered.filter((pro) => pro.type === "company");

  const faqs = [
    ["How do I know if a professional is certified?", "All verified professionals on Boulot Man pass identity, license, and reference checks before taking jobs."],
    ["What if I have an emergency?", "Use the emergency and fast responder filters to narrow the list to pros who can move immediately."],
    ["Can I get a custom quote for a large project?", "Yes. Companies on the platform can provide custom quotes for commercial and industrial jobs."],
  ];

  return (
    <div className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Categories</span>
            <span>/</span>
            <strong style={{ textTransform: "capitalize" }}>{categorySlug.replace(/-/g, " ")}</strong>
          </div>
          <h1 style={{ textTransform: "capitalize" }}>{categorySlug.replace(/-/g, " ")} Services</h1>
          <p>Find trusted, certified professionals for your project.</p>
          <div className={styles.heroStats}>
            {categoriesLoading ? (
              <SkeletonBlock style={{ width: 140, height: 18 }} />
            ) : (
              <div>{categoriesData?.length ?? 0} categories available</div>
            )}
            {tasksLoading ? (
              <SkeletonBlock style={{ width: 140, height: 18 }} />
            ) : (
              <div>{professionals.length} professionals listed</div>
            )}
            <div>Secure escrow payments</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Explore Subcategories</h2>
          <div className={styles.subcategoryRow}>
            {skillsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.subcategoryCard}>
                    <SkeletonBlock style={{ width: 40, height: 40, borderRadius: 8 }} />
                    <span style={{ flex: 1 }}>
                      <SkeletonBlock style={{ width: "70%", height: 14, marginBottom: 6 }} />
                      <SkeletonBlock style={{ width: "40%", height: 10 }} />
                    </span>
                  </div>
                ))
              : subcategories.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>No subcategories available.</div>
                )
                : subcategories.map((sub, i) => (
                    <button key={i} type="button" className={styles.subcategoryCard}>
                      <span className={styles.iconBox}><iconify-icon icon={sub.icon} /></span>
                      <span><strong>{sub.title}</strong><small>Browse</small></span>
                    </button>
                  ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Popular Services</h2>
          <div className={styles.servicesGrid}>
            {tasksLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : services.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>No services listed yet.</div>
                )
                : services.map((service, i) => (
                    <article key={i} className={styles.serviceCard}>
                      <span className={styles.serviceIcon}><iconify-icon icon={service.icon} /></span>
                      <h3>{service.title}</h3>
                      <div className={styles.servicePrice}>
                        <span>Starting price</span>
                        <strong>{service.price != null ? formatXOF(service.price) : "Contact for pricing"}</strong>
                      </div>
                    </article>
                  ))}
          </div>
        </div>
      </section>

      <main className={`${styles.container} ${styles.content}`}>
        <section className={styles.mainColumn}>
          <div className={styles.headerRow}>
            <div>
              <h2>Featured Professionals</h2>
              <p>{tasksLoading ? "Loading…" : `Showing ${featured.length} filtered technicians`}</p>
            </div>
            <div className={styles.headerActions}>
              <Link href={`/categories/${categorySlug}/listings`} className={styles.primarySmall}>
                Browse all professionals
              </Link>
              <button type="button" className={styles.ghostButton}>Recommended</button>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {tasksLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>No technicians match your filters.</div>
                )
                : featured.map((pro) => (
                    <article key={pro.id} className={styles.proCard}>
                      <div className={styles.cover}>
                        {pro.image ? <img src={pro.image} alt={pro.role} /> : <SkeletonBlock style={{ height: 140 }} />}
                        {pro.avatar ? (
                          <div className={styles.avatar}><img src={pro.avatar} alt={pro.name} /></div>
                        ) : null}
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.badges}>
                          {pro.fastResponder ? <span className={styles.badgePrimary}>Fast Responder</span> : null}
                          {pro.topRated ? <span className={styles.badgeAccent}>Top Rated</span> : null}
                          <span className={styles.badgeMuted}>{pro.hiresLabel}</span>
                        </div>
                        <h3>{pro.name}</h3>
                        <p>{pro.role}</p>
                        <div className={styles.meta}>
                          {pro.rating ? `${pro.rating.toFixed(1)}${pro.reviews ? ` (${pro.reviews})` : ""}` : "New"}
                          {pro.location ? ` · ${pro.location}` : ""}
                        </div>
                        <div className={styles.cardFooter}>
                          <div><strong>{pro.price != null ? formatXOF(pro.price) : "Contact"}</strong><small>{pro.priceUnit}</small></div>
                          <Link href={`/profile/${pro.id}`} className={styles.primarySmall}>Book Now</Link>
                        </div>
                      </div>
                    </article>
                  ))}
          </div>

          <section className={styles.banner}>
            <div>
              <h3>Can&apos;t find the perfect match?</h3>
              <p>Post your job once and let qualified professionals come to you with competitive quotes.</p>
            </div>
            <Link href="/post-task" className={styles.whiteButton}>Post a Job for Free</Link>
          </section>

          <div className={styles.headerRow}>
            <div>
              <h2>Top Rated Agencies</h2>
              <p>For large commercial or industrial projects</p>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {tasksLoading
              ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
              : companies.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>No companies match your filters.</div>
                )
                : companies.map((pro) => (
                    <article key={pro.id} className={styles.proCard}>
                      <div className={styles.cover}>
                        {pro.image ? <img src={pro.image} alt={pro.role} /> : <SkeletonBlock style={{ height: 140 }} />}
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.badges}><span className={styles.badgeMuted}>{pro.hiresLabel}</span></div>
                        <h3>{pro.name}</h3>
                        <p>{pro.role}</p>
                        <div className={styles.meta}>
                          {pro.rating ? `${pro.rating.toFixed(1)}${pro.reviews ? ` (${pro.reviews})` : ""}` : "New"}
                          {pro.location ? ` · ${pro.location}` : ""}
                        </div>
                        <div className={styles.cardFooter}>
                          <div><strong>{pro.price != null ? formatXOF(pro.price) : "Custom Quote"}</strong><small>{pro.priceUnit}</small></div>
                          <Link href={`/profile/${pro.id}`} className={styles.secondarySmall}>View Profile</Link>
                        </div>
                      </div>
                    </article>
                  ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h2>Filters</h2>
            <button type="button" className={styles.clearLink} onClick={() => {
              setAvailability({ today: false, emergency: false });
              setType("any");
              setYears(0);
              setRating(0);
            }}>Clear all</button>
          </div>

          <div className={styles.filterBlock}>
            <h3>Availability</h3>
            <label><input type="checkbox" checked={availability.today} onChange={() => setAvailability((v) => ({ ...v, today: !v.today }))} /> Available Today</label>
            <label><input type="checkbox" checked={availability.emergency} onChange={() => setAvailability((v) => ({ ...v, emergency: !v.emergency }))} /> Emergency (24/7)</label>
          </div>

          <div className={styles.filterBlock}>
            <h3>Professional Type</h3>
            <label><input type="radio" name="type" checked={type === "any"} onChange={() => setType("any")} /> Any</label>
            <label><input type="radio" name="type" checked={type === "technician"} onChange={() => setType("technician")} /> Independent Technician</label>
            <label><input type="radio" name="type" checked={type === "company"} onChange={() => setType("company")} /> Registered Company</label>
          </div>

          <div className={styles.filterBlock}>
            <h3>Years of Experience</h3>
            {[0, 3, 5, 10].map((value) => (
              <label key={value}><input type="radio" name="years" checked={years === value} onChange={() => setYears(value)} /> {value === 0 ? "Any" : `${value}+ Years`}</label>
            ))}
          </div>

          <div className={styles.filterBlock}>
            <h3>Minimum Rating</h3>
            {[0, 3.0, 4.0, 4.5].map((value) => (
              <label key={value}><input type="radio" name="rating" checked={rating === value} onChange={() => setRating(value)} /> {value === 0 ? "Any" : `${value} & up`}</label>
            ))}
          </div>

          <div className={styles.sidebarPromo}>
            <h3>Are you a certified Professional?</h3>
            <p>Join thousands of professionals earning more on Boulot Man. Get verified and access premium clients today.</p>
            <Link href="/signup" className={styles.primaryFull}>Apply as a Pro</Link>
          </div>
        </aside>
      </main>

      <section className={styles.howSection}>
        <div className={styles.container}>
          <h2 className={styles.centerTitle}>How to hire an electrician on Boulot Man</h2>
          <div className={styles.stepsGrid}>
            {HOW_STEPS.map((step, index) => (
              <article key={step.title} className={styles.stepCard}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <h2>Recent Verified Reviews</h2>
          </div>
          <div className={styles.reviewGrid}>
            <div style={{ padding: "24px 0", color: "#64748b" }}>Reviews are published once a client confirms a completed task.</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.centerTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map(([question, answer], index) => (
              <button
                key={question}
                type="button"
                className={styles.faqCard}
                onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}
              >
                <div className={styles.faqQuestion}>{question}</div>
                {faqOpen === index ? <p>{answer}</p> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
