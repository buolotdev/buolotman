"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { api } from "../../../lib/api";
import { useFetch } from "../../../lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "../../../components/skeleton/Skeleton";
import { formatXOF } from "../../../lib/format";
import styles from "./page.module.css";

type Listing = {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  image: string;
  avatar: string;
  jobsDone: number;
  response: string;
  rating: number;
  reviews: number;
  location: string;
  rate: number | string;
  verified?: boolean;
  availableToday?: boolean;
  emergency?: boolean;
  weekends?: boolean;
  backgroundChecked?: boolean;
  licensed?: boolean;
  type: "technician" | "company";
  skills: string[];
};

export default function Page({ params }: { params: { categorySlug: string } }) {
  const { categorySlug } = params;
  const { data: tasksData, loading } = useFetch(
    () => api.getTasks({ category: categorySlug }),
    []
  );

  const [availability, setAvailability] = useState({
    today: false,
    emergency: false,
    weekends: false,
  });
  const [trust, setTrust] = useState({
    verified: false,
    backgroundChecked: false,
    licensed: false,
  });
  const [type, setType] = useState<"any" | "technician" | "company">("any");
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);

  const listings: Listing[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (tasksData?.results ?? tasksData ?? []) as any[];
    return raw.map((item) => ({
      id: item.id,
      name: item.owner_name || item.name || item.title || "Professional",
      role: item.role || item.specialty || item.title || "Electrician",
      bio: item.bio || item.description || "",
      image: item.image || item.cover_image || "",
      avatar: item.avatar || item.avatar_url || "",
      jobsDone: Number(item.jobs_completed ?? item.jobsDone ?? 0),
      response: item.response_time || item.response || "—",
      rating: Number(item.rating ?? item.average_rating ?? 0),
      reviews: Number(item.reviews_count ?? item.reviews ?? 0),
      location: item.location || item.city || "",
      rate: item.hourly_rate ?? item.rate ?? item.starting_price ?? 0,
      verified: Boolean(item.verified ?? item.is_verified),
      availableToday: Boolean(item.available_today),
      emergency: Boolean(item.emergency ?? item.is_emergency),
      weekends: Boolean(item.weekends ?? item.available_weekends),
      backgroundChecked: Boolean(item.background_checked),
      licensed: Boolean(item.licensed),
      type: item.type || (item.company_name ? "company" : "technician"),
      skills: Array.isArray(item.skills) ? item.skills : [],
    }));
  }, [tasksData]);

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      if (type !== "any" && item.type !== type) return false;
      if (rating > 0 && item.rating < rating) return false;
      if (availability.today && !item.availableToday) return false;
      if (availability.emergency && !item.emergency) return false;
      if (availability.weekends && !item.weekends) return false;
      if (trust.verified && !item.verified) return false;
      if (trust.backgroundChecked && !item.backgroundChecked) return false;
      if (trust.licensed && !item.licensed) return false;
      return true;
    });
  }, [listings, availability, rating, trust, type]);

  const clearFilters = () => {
    setAvailability({ today: false, emergency: false, weekends: false });
    setTrust({ verified: false, backgroundChecked: false, licensed: false });
    setType("any");
    setRating(0);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBanner}>
        <iconify-icon icon="lucide:party-popper" />
        <span>
          New to Boulot Man? Get 10% off your first service booking with code <strong>WELCOME10</strong>
        </span>
      </div>

      <Header />

      <main className={`${styles.container} ${styles.content}`}>
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h2>Filters</h2>
            <button type="button" className={styles.clearFilters} onClick={clearFilters}>
              Clear all
            </button>
          </div>

          <div className={styles.filterSection}>
            <h3>Location</h3>
            <select className={styles.select} defaultValue="">
              <option value="">All locations</option>
            </select>
          </div>

          <div className={styles.filterSection}>
            <h3>Availability</h3>
            <label className={styles.option}><input type="checkbox" checked={availability.today} onChange={() => setAvailability((v) => ({ ...v, today: !v.today }))} /> Available Today</label>
            <label className={styles.option}><input type="checkbox" checked={availability.emergency} onChange={() => setAvailability((v) => ({ ...v, emergency: !v.emergency }))} /> Emergency (24/7)</label>
            <label className={styles.option}><input type="checkbox" checked={availability.weekends} onChange={() => setAvailability((v) => ({ ...v, weekends: !v.weekends }))} /> Weekends</label>
          </div>

          <div className={styles.filterSection}>
            <h3>Trust & Safety</h3>
            <label className={styles.option}><input type="checkbox" checked={trust.verified} onChange={() => setTrust((v) => ({ ...v, verified: !v.verified }))} /> ID Verified</label>
            <label className={styles.option}><input type="checkbox" checked={trust.backgroundChecked} onChange={() => setTrust((v) => ({ ...v, backgroundChecked: !v.backgroundChecked }))} /> Background Checked</label>
            <label className={styles.option}><input type="checkbox" checked={trust.licensed} onChange={() => setTrust((v) => ({ ...v, licensed: !v.licensed }))} /> Licensed Professional</label>
          </div>

          <div className={styles.filterSection}>
            <h3>Professional Type</h3>
            {[
              ["Any", "any"],
              ["Independent Technician", "technician"],
              ["Registered Company", "company"],
            ].map(([label, value]) => (
              <label key={value} className={styles.option}>
                <input type="radio" name="type" checked={type === value} onChange={() => setType(value as typeof type)} />
                {label}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h3>Minimum Rating</h3>
            {[0, 3.0, 4.0, 4.5].map((value) => (
              <label key={value} className={styles.option}>
                <input type="radio" name="rating" checked={rating === value} onChange={() => setRating(value)} />
                {value === 0 ? "Any" : `${value} & up`}
              </label>
            ))}
          </div>
        </aside>

        <section className={styles.mainColumn}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/categories/${categorySlug}`}>Categories</Link>
            <span>/</span>
            <strong style={{ textTransform: "capitalize" }}>{categorySlug.replace(/-/g, " ")} Professionals</strong>
          </div>

          <div className={styles.listingHeader}>
            <div>
              <h1 style={{ textTransform: "capitalize" }}>{categorySlug.replace(/-/g, " ")} Professionals</h1>
              <p>{loading ? "Loading…" : `${filtered.length} professionals available`}</p>
            </div>
            <div className={styles.listingControls}>
              <button type="button" className={styles.outlineButton}>Alert me of new pros</button>
              <button type="button" className={styles.outlineButton}>Highest Rated</button>
            </div>
          </div>

          <section className={styles.featuredPromo}>
            <div className={styles.featuredContent}>
              <div className={styles.featuredBadge}>Top Rated</div>
              <h2>Need a full commercial rewiring?</h2>
              <p>
                Browse our directory of certified electricians with verified work history and customer reviews.
              </p>
              <Link href="/search" className={styles.primaryButton}>
                Get a Free Consultation
              </Link>
            </div>
            <div className={styles.featuredImage}>
              <SkeletonBlock style={{ width: "100%", height: 200, borderRadius: 12 }} />
            </div>
          </section>

          <div className={styles.grid}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#64748b" }}>
                <p>No electricians match your filters yet.</p>
              </div>
            ) : (
              filtered.map((item) => (
                <article key={item.id} className={styles.card}>
                  <div className={styles.cardCover}>
                    {item.image ? (
                      <img src={item.image} alt={item.role} />
                    ) : (
                      <SkeletonBlock style={{ width: "100%", height: 160 }} />
                    )}
                    {item.verified ? <div className={styles.verifiedBadge}>Verified Pro</div> : null}
                    {item.avatar ? (
                      <div className={styles.avatarWrap}>
                        <img src={item.avatar} alt={item.name} />
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <h3>{item.name}</h3>
                      <button type="button" className={styles.iconButton}>
                        <iconify-icon icon="lucide:heart" />
                      </button>
                    </div>
                    <p className={styles.role}>{item.role}</p>
                    {item.bio ? <p className={styles.bio}>{item.bio}</p> : null}
                    <div className={styles.stats}>
                      <div>
                        <span>Jobs Done</span>
                        <strong>{item.jobsDone}</strong>
                      </div>
                      <div>
                        <span>Response</span>
                        <strong>{item.response}</strong>
                      </div>
                    </div>
                    {item.skills.length > 0 ? (
                      <div className={styles.skills}>
                        {item.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    ) : null}
                    <div className={styles.meta}>
                      {item.rating ? <span>{item.rating.toFixed(1)} ({item.reviews})</span> : <span>New pro</span>}
                      {item.location ? <span>{item.location}</span> : null}
                    </div>
                    <div className={styles.cardFooter}>
                      <div>
                        <strong>{item.rate ? formatXOF(item.rate) : "Contact for pricing"}</strong>
                        <small>Hourly rate</small>
                      </div>
                      <Link href={`/profile/${item.id}`} className={styles.primarySmallButton}>
                        View Profile
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {!loading && filtered.length > 0 && (
            <div className={styles.pagination}>
              <button type="button" className={styles.pageButton} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </button>
              <button
                type="button"
                className={`${styles.pageNumber} ${page === 1 ? styles.pageNumberActive : ""}`}
                onClick={() => setPage(1)}
              >
                1
              </button>
              <button type="button" className={styles.pageButton} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
