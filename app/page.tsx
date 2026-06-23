"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { api } from "./lib/api";
import { useFetch } from "./lib/useFetch";
import { SkeletonBlock, SkeletonStat } from "./components/skeleton/Skeleton";

const ICON_BY_KEY: Record<string, string> = {
  electrical: "lucide:zap",
  plumbing: "lucide:wrench",
  painting: "lucide:paint-roller",
  cleaning: "lucide:sofa",
  carpentry: "lucide:hammer",
  hvac: "lucide:fan",
  gardening: "lucide:flower-2",
  moving: "lucide:truck",
  default: "lucide:briefcase",
};

type PublicProfessional = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  country?: string;
  skills?: string[];
  completed_jobs?: number;
  average_rating?: number | string;
};

type PublicCompany = {
  id: number | string;
  company_name?: string;
  city?: string;
  country?: string;
  description?: string;
  projects_count?: number;
  services_count?: number;
  average_rating?: number | string;
  review_count?: number;
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    () => api.getCategories(),
    []
  );
  const { data: meData } = useFetch(
    () => {
      if (typeof window === "undefined") {
        return Promise.resolve(null);
      }
      return localStorage.getItem("access_token") ? api.getMe() : Promise.resolve(null);
    },
    []
  );
  const { data: prosData, loading: prosLoading } = useFetch(
    () => api.listUsers({ role: "technician", limit: "6" }),
    []
  );
  const { data: companiesData, loading: companiesLoading } = useFetch(
    () => api.listCompanies({ limit: "3" }),
    []
  );
  const { data: liveTasksData } = useFetch(
    () => api.getTasks({ sort: "newest", limit: "8" }),
    []
  );

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("access_token")));
  }, []);

  const categories = (categoriesData && categoriesData.length > 0
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categoriesData.map((c: any) => {
        const slug = (c.slug || c.name || "").toString().toLowerCase();
        return {
          name: c.name || c.title || slug,
          slug,
          icon: ICON_BY_KEY[slug] || ICON_BY_KEY.default,
        };
      })
    : []
  ).slice(0, 8);

  const pros = (Array.isArray(prosData) ? prosData : []) as PublicProfessional[];
  const companies = (Array.isArray(companiesData) ? companiesData : []) as PublicCompany[];
  const liveTasks = Array.isArray((liveTasksData as any)?.results)
    ? (liveTasksData as any).results
    : Array.isArray(liveTasksData)
      ? liveTasksData
      : [];

  const firstName = meData?.first_name || meData?.firstName || "";
  const greeting = firstName ? `Welcome back, ${firstName}` : "";

  const submitGlobalSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchCategory) params.set("category", searchCategory);
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const postTaskHref = isLoggedIn ? "/post-task" : "/login?next=%2Fpost-task";

  return (
    <div id="homepage-screen">
      <Header />

      <section id="hero" className="section">
        <div className="container">
          <div className="hero-shell">
            <div className="hero-glow hero-glow-left"></div>
            <div className="hero-glow hero-glow-right"></div>

            <div className="hero-content">
              <div className="eyebrow">
                Top-rated marketplace for home and business services
              </div>
              <h1 className="hero-title">
                {greeting || "Find trusted professionals for any job"}
              </h1>
              <p className="hero-copy">
                Hire skilled technicians, compare verified companies, and book
                reliable help in minutes. From quick repairs to ongoing
                business projects, Boulot Man helps you move faster.
              </p>

              <form className="hero-search-card" role="search" onSubmit={submitGlobalSearch}>
                <label className="hero-input">
                  <div className="icon-wrap" style={{ fontSize: "20px" }}>
                    <iconify-icon icon="lucide:search"></iconify-icon>
                  </div>
                  <span className="hero-input-stack">
                    <span className="hero-input-label">Task or service</span>
                    <input
                      className="hero-input-control"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Plumbing, website, AC repair..."
                      aria-label="Search tasks or services"
                    />
                  </span>
                </label>

                <label className="hero-input">
                  <div className="icon-wrap" style={{ fontSize: "20px" }}>
                    <iconify-icon icon="lucide:layers-3"></iconify-icon>
                  </div>
                  <span className="hero-input-stack">
                    <span className="hero-input-label">Category</span>
                    <select
                      className="hero-input-control"
                      value={searchCategory}
                      onChange={(event) => setSearchCategory(event.target.value)}
                      aria-label="Search by category"
                    >
                      <option value="">All categories</option>
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>

                <label className="hero-input">
                  <div className="icon-wrap" style={{ fontSize: "20px" }}>
                    <iconify-icon icon="lucide:map-pin"></iconify-icon>
                  </div>
                  <span className="hero-input-stack">
                    <span className="hero-input-label">Location</span>
                    <input
                      className="hero-input-control"
                      type="search"
                      value={searchLocation}
                      onChange={(event) => setSearchLocation(event.target.value)}
                      placeholder="City or country"
                      aria-label="Search by location"
                    />
                  </span>
                </label>

                <button type="submit" className="btn btn-primary hero-action hero-action-search" data-media-type="banani-button">
                  <span>Search services</span>
                  <div className="icon-wrap hero-action-icon" style={{ fontSize: "16px", width: "16px", height: "16px" }}>
                    <iconify-icon icon="lucide:arrow-right"></iconify-icon>
                  </div>
                </button>
              </form>
            </div>

            <div className="hero-side">
              <div className="hero-dashboard">
                <div className="dashboard-top">
                  <h3 className="dashboard-title">Featured matches</h3>
                  <div className="dashboard-badge">Verified today</div>
                </div>

                <div className="dash-list">
                  <div className="dash-item" data-media-type="banani-button">
                    <div className="dash-thumb">
                      <div className="icon-wrap" style={{ fontSize: "24px" }}>
                        <iconify-icon icon="lucide:zap"></iconify-icon>
                      </div>
                    </div>
                    <div>
                      <p className="dash-name">Browse electricians</p>
                      <p className="dash-meta">Wiring • Lighting • Repairs</p>
                    </div>
                    <Link href="/search?category=electrical" className="dash-price">View</Link>
                  </div>

                  <div className="dash-item" data-media-type="banani-button">
                    <div className="dash-thumb">
                      <div className="icon-wrap" style={{ fontSize: "24px" }}>
                        <iconify-icon icon="lucide:briefcase"></iconify-icon>
                      </div>
                    </div>
                    <div>
                      <p className="dash-name">Post a task</p>
                      <p className="dash-meta">Get matched with pros</p>
                    </div>
                    <Link href={postTaskHref} className="dash-price">Start</Link>
                  </div>

                  <div className="dash-item" data-media-type="banani-button">
                    <div className="dash-thumb">
                      <div className="icon-wrap" style={{ fontSize: "24px" }}>
                        <iconify-icon icon="lucide:search"></iconify-icon>
                      </div>
                    </div>
                    <div>
                      <p className="dash-name">Search services</p>
                      <p className="dash-meta">Filter by category, rating</p>
                    </div>
                    <Link href="/search" className="dash-price">Open</Link>
                  </div>
                </div>

                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="hero-stat-value">
                      {categoriesLoading ? <SkeletonBlock style={{ width: 60, height: 28 }} /> : categories.length}
                      {categoriesLoading ? null : "+"}
                    </div>
                    <p className="hero-stat-label">Categories available</p>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value">24/7</div>
                    <p className="hero-stat-label">Support available</p>
                  </div>
                  <div className="hero-stat">
                    <p className="hero-stat-value">Secure</p>
                    <p className="hero-stat-label">Escrow payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="activity-ticker" className="section">
        <div className="container">
          <div className="activity-ticker-shell">
            <div className="activity-ticker-head">
              <div>
                <div className="eyebrow">Live task activity</div>
                <h2 className="section-title">Fresh tasks posted right now</h2>
              </div>
              <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
                Search all
                <div className="icon-wrap" style={{ fontSize: "16px", width: "16px", height: "16px" }}>
                  <iconify-icon icon="lucide:arrow-right"></iconify-icon>
                </div>
              </Link>
            </div>

            <div className="activity-ticker-track" aria-label="Recent task activity">
              {(liveTasks.length > 0 ? liveTasks : [
                { title: "Loading recent tasks", city: "", category_name: "" },
              ]).map((task: any, index: number) => (
                <div key={`${task.id ?? index}`} className="activity-ticker-item">
                  <span className="activity-ticker-pill">{task.category_name || "Task"}</span>
                  <strong>{task.title}</strong>
                  <span>{task.city || task.location || "Location pending"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="container">
          <div className="section-header-flex">
            <div className="section-header section-header-left">
              <div className="eyebrow">Popular categories</div>
              <h2 className="section-title">Browse services by category</h2>
              <p className="section-copy">
                Discover vetted experts across the most requested home,
                office, and commercial service categories.
              </p>
            </div>
            <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
              View all
              <div
                className="icon-wrap"
                style={{ fontSize: "16px", width: "16px", height: "16px" }}
              >
                <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </div>
            </Link>
          </div>

          <div className="categories-grid">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card category-card">
                    <div className="category-icon">
                      <SkeletonBlock style={{ width: 40, height: 40, borderRadius: 8 }} />
                    </div>
                    <SkeletonBlock style={{ width: "60%", height: 18, marginTop: 12 }} />
                    <SkeletonBlock style={{ width: "100%", height: 12, marginTop: 8 }} />
                    <SkeletonBlock style={{ width: "40%", height: 10, marginTop: 8 }} />
                  </div>
                ))
              : categories.length === 0
                ? (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                    <p>No categories available yet.</p>
                  </div>
                )
                : categories.map((category) => {
                    const card = (
                      <>
                        <div className="category-icon">
                          <div className="icon-wrap" style={{ fontSize: "28px" }}>
                            <iconify-icon icon={category.icon}></iconify-icon>
                          </div>
                        </div>
                        <h3 className="category-title">{category.name}</h3>
                        <p className="category-copy">
                          Explore verified {category.name.toLowerCase()} professionals ready to help.
                        </p>
                        <div className="category-count">Browse category</div>
                      </>
                    );

                    if (category.slug === "electrical") {
                      return (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className="card category-card"
                          data-media-type="banani-button"
                        >
                          {card}
                        </Link>
                      );
                    }

                    return (
                      <Link
                        key={category.slug}
                        href={`/search?category=${category.slug}`}
                        className="card category-card"
                        data-media-type="banani-button"
                      >
                        {card}
                      </Link>
                    );
                  })}
          </div>
        </div>
      </section>

      <section id="benefits" className="section section-muted">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Why choose us</div>
            <h2 className="section-title">Built for trust and efficiency</h2>
            <p className="section-copy">
              We ensure every interaction on the platform is secure,
              transparent, and focused on delivering high-quality results.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrap" style={{ fontSize: "28px" }}>
                  <iconify-icon icon="lucide:shield-check"></iconify-icon>
                </div>
              </div>
              <h3 className="benefit-title">Verified Professionals</h3>
              <p className="benefit-copy">
                Every technician and company is thoroughly vetted for quality,
                skills, and background safety.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrap" style={{ fontSize: "28px" }}>
                  <iconify-icon icon="lucide:badge-dollar-sign"></iconify-icon>
                </div>
              </div>
              <h3 className="benefit-title">Transparent Pricing</h3>
              <p className="benefit-copy">
                No hidden fees or surprises. See estimated costs and compare
                quotes before you book a job.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrap" style={{ fontSize: "28px" }}>
                  <iconify-icon icon="lucide:lock"></iconify-icon>
                </div>
              </div>
              <h3 className="benefit-title">Secure Payments</h3>
              <p className="benefit-copy">
                Pay safely through the platform with buyer protection and
                digital escrow on every major project.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrap" style={{ fontSize: "28px" }}>
                  <iconify-icon icon="lucide:headset"></iconify-icon>
                </div>
              </div>
              <h3 className="benefit-title">24/7 Support</h3>
              <p className="benefit-copy">
                Our dedicated client support team is always online to help you
                resolve any issues quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="technicians" className="section">
        <div className="container">
          <div className="section-header-flex">
            <div className="section-header section-header-left">
              <div className="eyebrow">Featured technicians</div>
              <h2 className="section-title">Top-rated professionals near you</h2>
              <p className="section-copy">
                Book experts with strong reviews, quick response times, and
                proven experience in their field.
              </p>
            </div>
            <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
              See all technicians
              <div
                className="icon-wrap"
                style={{ fontSize: "16px", width: "16px", height: "16px" }}
              >
                <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </div>
            </Link>
          </div>

          <div className="profile-grid">
            {prosLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card profile-card">
                  <div className="profile-top">
                    <SkeletonBlock style={{ width: 56, height: 56, borderRadius: "50%" }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <SkeletonBlock style={{ width: "70%", height: 16, marginBottom: 8 }} />
                      <SkeletonBlock style={{ width: "40%", height: 12 }} />
                    </div>
                  </div>
                  <div className="chips">
                    <SkeletonBlock style={{ width: 80, height: 22, borderRadius: 12 }} />
                    <SkeletonBlock style={{ width: 60, height: 22, borderRadius: 12 }} />
                  </div>
                  <div className="profile-footer">
                    <SkeletonBlock style={{ width: 80, height: 14 }} />
                    <SkeletonBlock style={{ width: 60, height: 14 }} />
                  </div>
                </div>
              ))
            ) : pros.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "32px 0", textAlign: "center", color: "#64748b" }}>
                <p>No professionals available yet.</p>
              </div>
            ) : (
              pros.map((pro) => {
                const fullName = `${pro.first_name || ""} ${pro.last_name || ""}`.trim() || pro.username || "";
                const initials = `${pro.first_name?.[0] || ""}${pro.last_name?.[0] || ""}`.toUpperCase() || "•";
                return (
                  <Link
                    key={pro.id}
                    href={`/search?type=technician`}
                    className="card profile-card"
                    data-media-type="banani-button"
                  >
                    <div className="profile-top">
                      <div className="profile-avatar" style={{ background: "#e2e8f0", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {initials}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 className="profile-name">{fullName}</h3>
                        <p className="profile-role">{pro.country || ""}</p>
                      </div>
                    </div>
                    <div className="chips">
                      {(pro.skills || []).slice(0, 2).map((skill: string) => (
                        <span key={skill} className="chip">{skill}</span>
                      ))}
                    </div>
                    <div className="profile-footer">
                      <span>{pro.completed_jobs ?? 0} jobs</span>
                      <span>{pro.average_rating ? `${pro.average_rating} ★` : ""}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section id="companies" className="section section-muted">
        <div className="container">
          <div className="section-header-flex">
            <div className="section-header section-header-left">
              <div className="eyebrow">Featured companies</div>
              <h2 className="section-title">
                Trusted business teams for larger jobs
              </h2>
              <p className="section-copy">
                Compare established service companies for recurring work,
                office support, and large-scale projects.
              </p>
            </div>
            <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
              View all companies
              <div
                className="icon-wrap"
                style={{ fontSize: "16px", width: "16px", height: "16px" }}
              >
                <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </div>
            </Link>
          </div>

          <div className="company-grid">
            {companiesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card company-card">
                  <div className="company-head">
                    <div className="company-mark">
                      <SkeletonBlock style={{ width: 40, height: 40, borderRadius: 8 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <SkeletonBlock style={{ width: "60%", height: 16, marginBottom: 8 }} />
                      <SkeletonBlock style={{ width: "40%", height: 12 }} />
                    </div>
                  </div>
                  <SkeletonBlock style={{ width: "100%", height: 12, marginTop: 12 }} />
                  <SkeletonBlock style={{ width: "80%", height: 12, marginTop: 6 }} />
                  <div className="company-stats" style={{ marginTop: 16 }}>
                    <SkeletonStat />
                    <SkeletonStat />
                    <SkeletonStat />
                  </div>
                </div>
              ))
            ) : companies.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "32px 0", textAlign: "center", color: "#64748b" }}>
                <p>No companies available yet.</p>
              </div>
            ) : (
              companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/search?type=company`}
                  className="card company-card"
                  data-media-type="banani-button"
                >
                  <div className="company-head">
                    <div className="company-mark">
                      <iconify-icon icon="lucide:building-2" style={{ fontSize: "22px", color: "#0f172a" }}></iconify-icon>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="company-name">{company.company_name || ""}</h3>
                      <p className="company-loc">{company.city || company.country || ""}</p>
                    </div>
                  </div>
                  <p className="company-desc">
                    {company.description?.slice(0, 120) || ""}
                  </p>
                  <div className="company-stats" style={{ marginTop: 16 }}>
                    <div className="company-stat">
                      <strong>{company.projects_count ?? 0}</strong>
                      <span>Projects</span>
                    </div>
                    <div className="company-stat">
                      <strong>{company.services_count ?? 0}</strong>
                      <span>Services</span>
                    </div>
                    <div className="company-stat">
                      <strong>{company.review_count ?? 0}</strong>
                      <span>Reviews</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="testimonials" className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Client Testimonials</div>
            <h2 className="section-title">What our users say</h2>
            <p className="section-copy">
              Reviews are published once a client confirms a completed task.
            </p>
          </div>

          <div className="testimonials-grid">
            <div style={{ gridColumn: "1 / -1", padding: "32px 0", textAlign: "center", color: "#64748b" }}>
              <p>No client reviews yet. Reviews appear here after a task is completed and confirmed.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section section-muted">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">How it works</div>
            <h2 className="section-title">
              Book the right service in three simple steps
            </h2>
            <p className="section-copy">
              A straightforward flow designed to help clients discover,
              compare, and hire with confidence.
            </p>
          </div>

          <div className="steps-grid">
            <div className="card step-card">
              <div className="step-number">Step 1</div>
              <div className="step-icon">
                <div className="icon-wrap" style={{ fontSize: "28px" }}>
                  <iconify-icon icon="lucide:search-check"></iconify-icon>
                </div>
              </div>
              <h3 className="step-title">Search and filter</h3>
              <p className="step-copy">
                Enter the service you need, choose a category, and set your
                location to see relevant professionals.
              </p>
            </div>

            <div className="card step-card">
              <div className="step-number">Step 2</div>
              <div className="step-icon">
                <div className="icon-wrap" style={{ fontSize: "28px" }}>
                  <iconify-icon icon="lucide:badge-check"></iconify-icon>
                </div>
              </div>
              <h3 className="step-title">Compare verified profiles</h3>
              <p className="step-copy">
                Review ratings, experience, response times, and pricing before
                deciding who best fits your job.
              </p>
            </div>

            <div className="card step-card">
              <div className="step-number">Step 3</div>
              <div className="step-icon">
                <div className="icon-wrap" style={{ fontSize: "28px" }}>
                  <iconify-icon icon="lucide:calendar-check-2"></iconify-icon>
                </div>
              </div>
              <h3 className="step-title">Book and get it done</h3>
              <p className="step-copy">
                Contact the professional, confirm the schedule, and track the
                service with confidence from one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2 className="cta-title">
                Ready to hire faster or grow your business?
              </h2>
              <p className="cta-copy">
                Join clients, freelancers, and companies using Boulot Man to
                connect with trusted service opportunities every day.
              </p>
            </div>
            <div className="cta-actions">
              <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
                Browse services
              </Link>
              <Link href="/signup" className="btn btn-primary" data-media-type="banani-button">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
