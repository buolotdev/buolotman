"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { api } from "../../../lib/api";
import { useFetch } from "../../../lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "../../../components/skeleton/Skeleton";
import { formatXOF } from "../../../lib/format";
import { MASTER_CATEGORIES } from "../../../lib/categories";
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

export default function Page() {
  const rawParams = useParams();
  const rawSlug = (rawParams?.categorySlug as string) || "";
  const categorySlug = decodeURIComponent(rawSlug || "");

  // Find master category metadata from MASTER_CATEGORIES
  const currentMaster = useMemo(() => {
    if (!categorySlug) return null;
    const clean = categorySlug.toLowerCase().trim();
    return (
      MASTER_CATEGORIES.find(
        (c) =>
          c.slug === clean ||
          c.slug.includes(clean) ||
          clean.includes(c.slug) ||
          c.name.toLowerCase().replace(/[^a-z0-9]/g, "-").includes(clean)
      ) || null
    );
  }, [categorySlug]);

  const displayName = currentMaster?.name || (categorySlug ? categorySlug.replace(/-/g, " ") : "Category");

  const { data: tasksData, loading } = useFetch(
    () => (categorySlug ? api.getTasks({ category: categorySlug }) : Promise.resolve([])),
    [categorySlug]
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
    const raw = ((tasksData as any)?.results ?? tasksData ?? []) as any[];
    if (raw.length > 0) {
      return raw.map((item) => ({
        id: item.id,
        name: item.owner_name || item.name || item.title || "Professional",
        role: item.role || item.specialty || item.title || displayName,
        bio: item.bio || item.description || "",
        image: item.image || item.cover_image || "",
        avatar: item.avatar || item.avatar_url || "",
        jobsDone: Number(item.jobs_completed ?? item.jobsDone ?? 10),
        response: item.response_time || item.response || "< 15 mins",
        rating: Number(item.rating ?? item.average_rating ?? 4.8),
        reviews: Number(item.reviews_count ?? item.reviews ?? 14),
        location: item.location || item.city || "Abidjan / Remote",
        rate: item.hourly_rate ?? item.rate ?? item.starting_price ?? 25000,
        verified: Boolean(item.verified ?? item.is_verified ?? true),
        availableToday: Boolean(item.available_today ?? true),
        emergency: Boolean(item.emergency ?? item.is_emergency),
        weekends: Boolean(item.weekends ?? item.available_weekends ?? true),
        backgroundChecked: Boolean(item.background_checked ?? true),
        licensed: Boolean(item.licensed ?? true),
        type: item.type || (item.company_name ? "company" : "technician"),
        skills: Array.isArray(item.skills) ? item.skills : (currentMaster?.skills?.slice(0, 4) || []),
      }));
    }

    // Default curated sample listings
    const sampleSkills = currentMaster?.skills || ["Installation", "Maintenance", "Consulting", "Repairs"];

    return [
      {
        id: "lst-1",
        name: "Amadou Diallo",
        role: `Lead Specialist · ${displayName}`,
        bio: "Over 8 years of certified field experience delivering top-tier engineering and technical services with rigorous safety standards.",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        jobsDone: 42,
        response: "< 10 mins",
        rating: 4.9,
        reviews: 35,
        location: "Abidjan, CI",
        rate: 25000,
        verified: true,
        availableToday: true,
        emergency: true,
        weekends: true,
        backgroundChecked: true,
        licensed: true,
        type: "technician",
        skills: sampleSkills.slice(0, 4),
      },
      {
        id: "lst-2",
        name: "Koffi Mensah",
        role: `Senior Expert · ${displayName}`,
        bio: "Specialized in troubleshooting, preventive maintenance, installations and commercial-grade work across West Africa.",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=60",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        jobsDone: 29,
        response: "< 20 mins",
        rating: 4.8,
        reviews: 21,
        location: "Yamoussoukro / Remote",
        rate: 30000,
        verified: true,
        availableToday: true,
        emergency: false,
        weekends: true,
        backgroundChecked: true,
        licensed: true,
        type: "technician",
        skills: sampleSkills.slice(2, 6),
      },
      {
        id: "lst-3",
        name: "Apex Engineering & Services Sarl",
        role: `Registered Contracting Firm · ${displayName}`,
        bio: "Full turnkey contracting, site surveys, multi-technician teams and commercial project management.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60",
        avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
        jobsDone: 85,
        response: "< 15 mins",
        rating: 5.0,
        reviews: 64,
        location: "Abidjan Cocody",
        rate: 150000,
        verified: true,
        availableToday: true,
        emergency: true,
        weekends: true,
        backgroundChecked: true,
        licensed: true,
        type: "company",
        skills: sampleSkills.slice(0, 5),
      }
    ];
  }, [tasksData, displayName, currentMaster]);

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
              <option value="abidjan">Abidjan, Ivory Coast</option>
              <option value="yamoussoukro">Yamoussoukro</option>
              <option value="sanpedro">San-Pédro</option>
              <option value="remote">Remote / Nationwide</option>
            </select>
          </div>

          <div className={styles.filterSection}>
            <h3>Availability</h3>
            <label className={styles.option}><input type="checkbox" checked={availability.today} onChange={() => setAvailability((v) => ({ ...v, today: !v.today }))} /> Available Today</label>
            <label className={styles.option}><input type="checkbox" checked={availability.emergency} onChange={() => setAvailability((v) => ({ ...v, emergency: !v.emergency }))} /> Emergency (24/7)</label>
            <label className={styles.option}><input type="checkbox" checked={availability.weekends} onChange={() => setAvailability((v) => ({ ...v, weekends: !v.weekends }))} /> Weekends</label>
          </div>

          <div className={styles.filterSection}>
            <h3>Trust &amp; Safety</h3>
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
            <Link href="/service-categories">Categories</Link>
            <span>/</span>
            <Link href={`/categories/${categorySlug}`}>{displayName}</Link>
            <span>/</span>
            <strong>Listings</strong>
          </div>

          <div className={styles.listingHeader}>
            <div>
              <h1>{displayName} Directory</h1>
              <p>{loading && listings.length === 0 ? "Loading…" : `${filtered.length} professionals and companies available`}</p>
            </div>
            <div className={styles.listingControls}>
              <Link href="/post-task" className={styles.outlineButton} style={{ textDecoration: "none" }}>Post a Task</Link>
              <button type="button" className={styles.outlineButton}>Highest Rated</button>
            </div>
          </div>

          <section className={styles.featuredPromo}>
            <div className={styles.featuredContent}>
              <div className={styles.featuredBadge}>Top Rated</div>
              <h2>Need custom quotes for {displayName}?</h2>
              <p>
                Browse our directory of verified experts with verified work history, credentials, and customer reviews.
              </p>
              <Link href="/post-task" className={styles.primaryButton}>
                Get Free Competitive Quotes
              </Link>
            </div>
            <div className={styles.featuredImage}>
              <SkeletonBlock style={{ width: "100%", height: 200, borderRadius: 12 }} />
            </div>
          </section>

          <div className={styles.grid}>
            {loading && listings.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#64748b" }}>
                <p>No professionals match your selected filters yet.</p>
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
                      {item.rating ? <span>★ {item.rating.toFixed(1)} ({item.reviews} reviews)</span> : <span>New pro</span>}
                      {item.location ? <span>{item.location}</span> : null}
                    </div>
                    <div className={styles.cardFooter}>
                      <div>
                        <strong>{item.rate ? formatXOF(typeof item.rate === 'number' ? item.rate : parseInt(item.rate) || 25000) : "Contact for pricing"}</strong>
                        <small>{item.type === "company" ? "Project rate" : "Starting rate"}</small>
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
