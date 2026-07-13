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
  "engineering-technology-services": "lucide:cpu",
  "it-infrastructure-networking": "lucide:network",
  "cybersecurity-services": "lucide:shield-check",
  "cloud-systems-engineering": "lucide:cloud",
  "electrical-electronics-engineering": "lucide:zap",
  "mechanical-civil-industrial": "lucide:hard-hat",
  "renewable-energy-utilities": "lucide:sun",
  "specialized-technical-services": "lucide:sliders",
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

  /* ── Intersection Observer for scroll animations ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          } else {
            // Remove the class when out of view so it animates again next time
            entry.target.classList.remove("animate-in");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" } // Triggers slightly earlier
    );

    const benefitsSection = document.getElementById("benefits");
    if (benefitsSection) {
      observer.observe(benefitsSection);
    }

    return () => observer.disconnect();
  }, []);

  /* ── Scroll-driven SVG connector line between HIW circles ── */
  useEffect(() => {
    const section = document.getElementById("how-it-works");
    if (!section) return;

    // Create SVG overlay (z-index 0 so it stays behind images/text)
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("id", "hiw-scroll-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:visible;";

    // Glow filter
    const defs = document.createElementNS(NS, "defs");
    defs.innerHTML = `
      <filter id="hiw-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    // Background (faded) track
    const pathBg = document.createElementNS(NS, "path");
    pathBg.setAttribute("fill", "none");
    pathBg.setAttribute("stroke", "rgba(255,100,0,0.1)");
    pathBg.setAttribute("stroke-width", "3");
    pathBg.setAttribute("stroke-dasharray", "6 8");
    svg.appendChild(pathBg);

    // Animated foreground path
    const path = document.createElementNS(NS, "path");
    path.setAttribute("id", "hiw-connector-path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ff4500");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("filter", "url(#hiw-glow)");
    svg.appendChild(path);

    // Moving dot at the front of the line
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("r", "6");
    dot.setAttribute("fill", "#ff4500");
    dot.setAttribute("filter", "url(#hiw-glow)");
    svg.appendChild(dot);

    section.style.position = "relative";
    section.insertBefore(svg, section.firstChild);

    let totalLength = 0;

    const buildPath = () => {
      const circles = section.querySelectorAll<HTMLElement>(".hiw-img-circle");
      if (circles.length < 2) return 0;

      const secRect = section.getBoundingClientRect();
      const points: { x: number; y: number }[] = [];

      circles.forEach((c) => {
        const r = c.getBoundingClientRect();
        points.push({
          x: r.left - secRect.left + r.width / 2,
          y: r.top - secRect.top + r.height / 2,
        });
      });

      // Elegant gentle S-curve (doesn't swing out wildy)
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        // Control points exactly halfway vertically between the two points
        const cy = p0.y + (p1.y - p0.y) / 2;
        d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
      }

      path.setAttribute("d", d);
      pathBg.setAttribute("d", d);

      const len = path.getTotalLength();
      path.setAttribute("stroke-dasharray", String(len));
      path.setAttribute("stroke-dashoffset", String(len));
      return len;
    };

    const onScroll = () => {
      if (totalLength === 0) totalLength = buildPath();
      if (totalLength === 0) return;

      const secRect = section.getBoundingClientRect();
      const secH = section.offsetHeight;
      const vh = window.innerHeight;

      // Calculate scroll progress (0 to 1) based on section visibility
      const scrolled = Math.max(0, vh - secRect.top - 200); // offset so it starts drawing a bit later
      const maxScroll = secH + vh - 400;
      const progress = Math.min(1, Math.max(0, scrolled / maxScroll));

      const drawn = totalLength * progress;
      const remaining = totalLength - drawn;

      path.setAttribute("stroke-dashoffset", String(remaining));

      if (progress > 0 && progress < 1) {
        try {
          const pt = path.getPointAtLength(drawn);
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
          dot.setAttribute("opacity", "1");
        } catch {
          dot.setAttribute("opacity", "0");
        }
      } else {
        dot.setAttribute("opacity", "0");
      }
    };

    const timer = setTimeout(() => {
      totalLength = buildPath();
      onScroll();
    }, 400);

    window.addEventListener("scroll", onScroll, { passive: true });
    const resizeOb = new ResizeObserver(() => {
      totalLength = buildPath();
      onScroll();
    });
    resizeOb.observe(section);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      resizeOb.disconnect();
      svg.remove();
    };
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
                            <iconify-icon icon={ICON_BY_KEY[category.slug] || category.icon || ICON_BY_KEY.default}></iconify-icon>
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

      <section id="benefits" style={{ background: "#fdfdfd", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <style>{`
          .mb-header { text-align: center; max-width: 800px; margin: 0 auto 60px; position: relative; z-index: 2; opacity: 0; transform: translateY(20px); transition: opacity 0.8s, transform 0.8s; }
          #benefits.animate-in .mb-header { opacity: 1; transform: translateY(0); }
          .mb-eyebrow { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #ff4500; margin-bottom: 16px; font-weight: 700; background: rgba(255,69,0,0.1); padding: 6px 16px; border-radius: 20px; display: inline-block; }
          .mb-title { font-family: 'Playfair Display', serif; font-size: 48px; color: #0a1628; margin-bottom: 24px; font-weight: 800; line-height: 1.2; }
          .mb-copy { font-size: 18px; color: #4a5568; line-height: 1.6; }
          
          /* 3D Perspective Grid */
          .mb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 0 32px; perspective: 1500px; }
          
          /* 3D Flip In Animation */
          @keyframes flipIn3D {
            0% { opacity: 0; transform: rotateY(-70deg) scale(0.85) translateZ(-50px); }
            60% { opacity: 1; transform: rotateY(8deg) scale(1.02) translateZ(10px); }
            100% { opacity: 1; transform: rotateY(0deg) scale(1) translateZ(0); }
          }
          
          .mb-card { background: linear-gradient(145deg, #0d2137 0%, #0a1628 100%); border-radius: 28px; padding: 44px 36px 36px; color: #fff; display: flex; flex-direction: column; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s, background 0.4s; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); height: 510px; opacity: 0; transform-style: preserve-3d; transform-origin: left center; }
          
          #benefits.animate-in .mb-card { animation: flipIn3D 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          #benefits.animate-in .mb-card:nth-child(1) { animation-delay: 0.1s; }
          #benefits.animate-in .mb-card:nth-child(2) { animation-delay: 0.25s; }
          #benefits.animate-in .mb-card:nth-child(3) { animation-delay: 0.4s; }
          #benefits.animate-in .mb-card:nth-child(4) { animation-delay: 0.55s; }
          
          /* Premium Hover Effects */
          .mb-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at top right, rgba(255,69,0,0.15), transparent 60%); opacity: 0; transition: opacity 0.5s; pointer-events: none; z-index: 1; }
          .mb-card:hover { transform: translateY(-12px) scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,69,0,0.3); }
          .mb-card:hover::before { opacity: 1; }
          
          /* Card Header */
          .mb-card-header { 
            position: relative; 
            z-index: 2; 
            transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
            transform: translateY(130px);
          }
          .mb-card:hover .mb-card-header {
            transform: translateY(0);
          }
          
          .mb-card-title { 
            font-family: 'Playfair Display', serif; 
            font-size: 34px; 
            font-weight: 700; 
            margin: 0; 
            line-height: 1.2; 
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); 
            text-align: center;
            margin-top: 110px; /* Space for the absolute center icon */
          }
          .mb-card:hover .mb-card-title { 
            text-align: left;
            margin-top: 0;
            padding-right: 50px;
          }
          
          .mb-card-icon { 
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            font-size: 80px; 
            color: #fff; 
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); 
          }
          .mb-card:hover .mb-card-icon { 
            left: 100%;
            transform: translateX(-100%) rotate(5deg);
            font-size: 34px; 
            color: #ff4500; 
          }
          
          /* Card Content */
          .mb-hidden-content { 
            position: relative; 
            z-index: 2; 
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
            pointer-events: none;
            margin-top: 30px;
          }
          .mb-card:hover .mb-hidden-content {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
          
          .mb-card-content { color: #b8c8d8; font-size: 16px; line-height: 1.7; transition: color 0.3s; }
          .mb-card:hover .mb-card-content { color: #fff; }
          
          /* Faint Icons (Bottom Left) */
          .mb-faint-icon { font-size: 140px; color: rgba(255,255,255,0.02); position: absolute; bottom: 20px; left: 20px; pointer-events: none; z-index: 1; transition: all 0.8s cubic-bezier(0.2,0.8,0.2,1); opacity: 0; transform: translateY(20px); }
          .mb-card:hover .mb-faint-icon { color: rgba(255,255,255,0.06); transform: translateY(0); opacity: 1; }
          
          /* Circle Progress */
          @keyframes fillCircle { from { background: conic-gradient(#ff4500 0% 0%, rgba(255,255,255,0.1) 0% 100%); } to { background: conic-gradient(#ff4500 0% 96%, rgba(255,255,255,0.1) 96% 100%); } }
          .mb-progress-circle { width: 160px; height: 160px; border-radius: 50%; background: conic-gradient(rgba(255,255,255,0.1) 0% 100%); margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; }
          .mb-card:hover .mb-progress-circle { animation: fillCircle 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .mb-progress-circle-inner { width: 140px; height: 140px; border-radius: 50%; background: #0d2137; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: background 0.5s; }
          .mb-card:hover .mb-progress-circle-inner { background: #0a1628; }
          .mb-progress-val { font-size: 36px; font-weight: 800; color: #fff; line-height: 1; }
          .mb-progress-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #ffaa00; margin-top: 10px; }
          
          /* Horizontal Progress */
          @keyframes growBar { from { width: 0%; } to { width: 99%; } }
          .mb-progress-bar-container { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin: 10px 0 30px; overflow: hidden; }
          .mb-progress-bar-fill { height: 100%; background: linear-gradient(90deg, #ff4500, #ff8c00); border-radius: 3px; width: 0%; }
          .mb-card:hover .mb-progress-bar-fill { animation: growBar 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          
          @media (max-width: 1024px) {
            .mb-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 640px) {
            .mb-grid { grid-template-columns: 1fr; }
            .mb-card { height: 420px; }
          }
        `}</style>
        
        {/* Background SVGs (Matsols style wavy lines) */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", opacity: 0.8 }}>
          <svg viewBox="0 0 1440 800" fill="none" style={{ position: "absolute", width: "120%", height: "auto", top: "-10%", left: "-10%" }}>
            <path d="M-100 300 C 400 -100, 800 600, 1500 200" stroke="#dcb4a0" strokeWidth="2" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
            <path d="M-100 400 C 500 -50, 1000 800, 1500 400" stroke="#dcb4a0" strokeWidth="8" strokeOpacity="0.3" fill="none" strokeLinecap="round" />
            <path d="M-100 700 C 600 300, 1200 900, 1500 100" stroke="#dcb4a0" strokeWidth="12" strokeOpacity="0.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <div className="mb-header">
          <div className="mb-eyebrow">Why choose us</div>
          <h2 className="mb-title">Built for trust and efficiency</h2>
          <p className="mb-copy">
            We ensure every interaction on the platform is secure,
            transparent, and focused on delivering high-quality results.
          </p>
        </div>

        <div className="mb-grid">
          {/* Card 1 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">Verified<br/>Professionals</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:globe"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <p className="mb-card-content">
                Every technician and company is thoroughly vetted for quality, skills, and background safety. Our platform ensures that professionals meet strict standards before they connect with clients.
              </p>
            </div>
            <div className="mb-faint-icon"><iconify-icon icon="lucide:globe"></iconify-icon></div>
          </div>

          {/* Card 2 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">Success Rate</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:line-chart"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <div className="mb-progress-circle">
                <div className="mb-progress-circle-inner">
                  <div className="mb-progress-val">96%</div>
                  <div className="mb-progress-label">SATISFACTION</div>
                </div>
              </div>
              <p className="mb-card-content">
                With a proven track record, thousands of clients have successfully completed jobs through ProMatch. Our professionals focus on achieving strong results.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">Secure<br/>Payments</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:shield"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <p className="mb-card-content">
                We respect your privacy and provide professional, secure support throughout your journey. As a trusted platform, ProMatch ensures that all your payments are handled with full security and integrity.
              </p>
            </div>
            <div className="mb-faint-icon"><iconify-icon icon="lucide:fingerprint"></iconify-icon></div>
          </div>

          {/* Card 4 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">Tailored<br/>Pathways</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:git-pull-request"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <div className="mb-progress-bar-container">
                <div className="mb-progress-bar-fill"></div>
              </div>
              <p className="mb-card-content">
                Every job is unique, and so is our guidance. ProMatch designs personalized service pathways based on your goals, requirements, and budget constraints.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="promo-banner" className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="promo-banner-container">
            <div className="promo-banner-grid">
              <div className="promo-banner-left">
                <div className="promo-banner-brand">
                  Boulot Man <span>Pro.</span>
                </div>
                <h2 className="promo-banner-title">
                  Let experts find the right professional for you
                </h2>
                <ul className="promo-banner-list">
                  <li>Work with experts who will source, interview, and vet professionals for you</li>
                  <li>Get a report with clear recommendations</li>
                  <li>Hire vetted technical talent with confidence</li>
                </ul>
                <Link href="/search" className="promo-banner-btn" data-media-type="banani-button">
                  Discover expert sourcing
                </Link>
                <div className="promo-banner-guarantee">
                  <iconify-icon icon="lucide:shield-check" style={{ fontSize: "18px", color: "#fff" }}></iconify-icon>
                  100% money-back guarantee
                </div>
              </div>
              <div className="promo-banner-right">
                <div className="promo-visuals">
                  <div className="promo-card promo-card-1">
                    <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Professional 1" />
                    <div className="promo-card-info">
                      <h4>Ngozi O.</h4>
                      <p>IT Infrastructure</p>
                    </div>
                  </div>
                  <div className="promo-card promo-card-2">
                    <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Professional 2" />
                    <div className="promo-card-info">
                      <h4>Adebayo A.</h4>
                      <p>Lead Engineer</p>
                    </div>
                  </div>
                  <div className="promo-card promo-card-3">
                    <img src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Professional 3" />
                    <div className="promo-card-info">
                      <h4>Fatima I.</h4>
                      <p>Systems Architect</p>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* ══════════ WHY CHOOSE US (MATSOLS STYLE) ══════════ */}
      <section id="why-choose-us" style={{ background: "#0a1628", color: "#fff", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        {/* Top-Right Background Circles */}
        <div style={{ position: "absolute", top: "-50px", right: "-20px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.05)", border: "2px solid #ff4500", zIndex: 0, pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.02)", border: "2px solid rgba(255, 69, 0, 0.5)", zIndex: 0, pointerEvents: "none" }}></div>

        {/* Bottom Background Circles with Watermark */}
        <div style={{ position: "absolute", bottom: "-100px", left: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.02)", border: "2px solid rgba(255, 69, 0, 0.5)", zIndex: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <span style={{ fontSize: "34px", fontWeight: "900", color: "rgba(255, 255, 255, 0.05)", letterSpacing: "4px", whiteSpace: "nowrap" }}>BOULOT MAN</span>
        </div>
        <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.05)", border: "2px solid #ff4500", zIndex: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <span style={{ fontSize: "24px", fontWeight: "900", color: "rgba(255, 255, 255, 0.1)", letterSpacing: "3px", whiteSpace: "nowrap" }}>BOULOT MAN</span>
        </div>

        {/* Wavy background SVGs and abstract floating shapes */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }}>
          <svg viewBox="0 0 1440 800" fill="none" style={{ position: "absolute", width: "150%", height: "auto", top: "-10%", left: "-25%", transform: "rotate(-5deg)" }}>
            {/* Wavy Lines */}
            <path d="M0 400 C 400 200, 800 600, 1440 400" stroke="#ff4500" strokeWidth="6" strokeOpacity="0.15" fill="none" strokeLinecap="round" />
            <path d="M0 500 C 500 200, 1000 800, 1440 600" stroke="#ff4500" strokeWidth="3" strokeOpacity="0.15" fill="none" strokeLinecap="round" />
            <path d="M0 600 C 600 300, 1200 700, 1440 300" stroke="#cc3700" strokeWidth="10" strokeOpacity="0.1" fill="none" strokeLinecap="round" />
            <path d="M200 200 C 500 800, 900 100, 1440 500" stroke="#ffaa00" strokeWidth="4" strokeOpacity="0.08" fill="none" strokeLinecap="round" />
            
            {/* Abstract Hand-drawn Shapes */}
            {/* Top Left Triangle with dot */}
            <g transform="translate(300, 250) rotate(15)">
              <path d="M 0,-20 L 25,20 L -25,20 Z" stroke="#ffaa00" strokeWidth="2" strokeOpacity="0.3" strokeLinejoin="round" />
              <circle cx="0" cy="8" r="3" fill="#ffaa00" fillOpacity="0.4" />
            </g>
            
            {/* Center Top Triangle with dot */}
            <g transform="translate(850, 280) rotate(-20)">
              <path d="M 0,-25 L 30,25 L -30,25 Z" stroke="#ffaa00" strokeWidth="2" strokeOpacity="0.3" strokeLinejoin="round" />
              <circle cx="0" cy="10" r="4" fill="#ffaa00" fillOpacity="0.4" />
            </g>

            {/* Floating Dots/Circles */}
            <circle cx="200" cy="150" r="4" fill="#ff4500" fillOpacity="0.3" />
            <circle cx="1100" cy="120" r="6" fill="#ffaa00" fillOpacity="0.2" />
            <circle cx="1300" cy="500" r="5" fill="#ff4500" fillOpacity="0.3" />
            <circle cx="450" cy="650" r="7" stroke="#ffaa00" strokeWidth="2" strokeOpacity="0.3" fill="none" />
            <circle cx="750" cy="180" r="5" stroke="#ff4500" strokeWidth="2" strokeOpacity="0.3" fill="none" />
            
            {/* Squiggly line right side */}
            <path d="M 1200 300 Q 1230 350, 1200 400 T 1200 500" stroke="#ff4500" strokeWidth="2" strokeOpacity="0.2" fill="none" strokeLinecap="round" />
            
            {/* Crosses */}
            <g transform="translate(600, 600)" stroke="#ff4500" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round">
              <line x1="-10" y1="-10" x2="10" y2="10" />
              <line x1="10" y1="-10" x2="-10" y2="10" />
            </g>
          </svg>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .wcu-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 80px;
            align-items: center;
          }
          .wcu-left {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .wcu-title {
            font-size: 56px;
            font-weight: 800;
            line-height: 1.1;
            font-family: 'Playfair Display', 'Times New Roman', Times, serif;
            color: #fff;
          }
          .wcu-desc {
            font-size: 18px;
            line-height: 1.6;
            color: rgba(255,255,255,0.75);
            max-width: 440px;
          }
          .wcu-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 16px 32px;
            background: #ff4500;
            color: #fff;
            border-radius: 999px;
            font-weight: 700;
            font-size: 16px;
            text-decoration: none;
            width: fit-content;
            transition: all 0.2s;
            margin-top: 16px;
          }
          .wcu-btn:hover {
            transform: scale(1.05);
            background: #e03d00;
          }
          .wcu-image-circle {
            width: 380px;
            height: 380px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid rgba(255,69,0,0.3);
            margin-top: 40px;
            position: relative;
          }
          .wcu-image-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .wcu-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .wcu-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            height: 280px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 24px;
            transition: transform 0.3s, border-color 0.3s;
          }
          .wcu-card:hover {
            transform: scale(1.05) translateY(-5px);
            border-color: rgba(255,69,0,0.6);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10;
          }
          .wcu-card-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
          }
          .wcu-card-bg img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.75;
            transition: opacity 0.3s, transform 0.5s;
          }
          .wcu-card:hover .wcu-card-bg img {
            opacity: 1;
            transform: scale(1.05);
          }
          .wcu-card-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.0) 80%);
            z-index: 1;
          }
          .wcu-card-content {
            position: relative;
            z-index: 2;
          }
          .wcu-card-label {
            color: #ff4500;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 12px;
          }
          .wcu-card-title {
            color: #fff;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .wcu-card-desc {
            color: rgba(255,255,255,0.7);
            font-size: 14px;
            line-height: 1.5;
          }
          /* Layout adjustments for masonry-like stagger */
          .wcu-col-1 {
            margin-top: 60px;
          }
          
          @media (max-width: 1024px) {
            .wcu-container {
              grid-template-columns: 1fr;
              gap: 40px;
            }
            .wcu-image-circle {
              width: 300px;
              height: 300px;
              margin: 24px auto 0;
            }
            .wcu-left {
              align-items: center;
              text-align: center;
            }
          }
          @media (max-width: 640px) {
            .wcu-grid {
              grid-template-columns: 1fr;
            }
            .wcu-col-1 {
              margin-top: 0;
            }
          }
        `}} />

        <div className="wcu-container">
          <div className="wcu-left">
            <h2 className="wcu-title">Why Choose ProMatch?</h2>
            <p className="wcu-desc">
              We don't just find you a service provider—we deliver peace of mind. The principles that drive our excellence and innovation ensure your success every step of the way.
            </p>
            <Link href="/search" className="wcu-btn">
              Start Your Journey
            </Link>
            
            <div className="wcu-image-circle">
              <img src="/black_african_professional_male.png" alt="African professional" />
            </div>
          </div>

          <div className="wcu-grid">
            <div className="wcu-col wcu-col-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step1.png" alt="Strategy" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">STRATEGY</div>
                  <h3 className="wcu-card-title">Personalized Strategy</h3>
                  <p className="wcu-card-desc">Tailored service roadmaps, not just generic worker lists.</p>
                </div>
              </div>

              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step3.png" alt="Network" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">NETWORK</div>
                  <h3 className="wcu-card-title">Global Network</h3>
                  <p className="wcu-card-desc">Direct partnerships with top-tier verified professionals.</p>
                </div>
              </div>
            </div>

            <div className="wcu-col wcu-col-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step2.png" alt="Support" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">SUPPORT</div>
                  <h3 className="wcu-card-title">End-to-End Support</h3>
                  <p className="wcu-card-desc">From request to completion, we handle it all.</p>
                </div>
              </div>

              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step4.png" alt="Funding" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">SECURITY</div>
                  <h3 className="wcu-card-title">Secure Escrow Payments</h3>
                  <p className="wcu-card-desc">Maximized security through our verified escrow system.</p>
                </div>
              </div>
              
              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/black_african_professional.png" alt="Legal" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">VERIFIED</div>
                  <h3 className="wcu-card-title">100% Guaranteed Success</h3>
                  <p className="wcu-card-desc">99% approval rate with our compliance and vetting team.</p>
                </div>
              </div>
            </div>
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
                      <iconify-icon icon="lucide:building-2" style={{ fontSize: "22px", color: "#ffffff" }}></iconify-icon>
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

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" style={{ background: "#0a1628", color: "#fff", padding: "0", overflow: "visible", position: "relative" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Orange progress line */
          @keyframes hiwLine {
            from { width: 0; }
            to   { width: 100%; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .hiw-wrapper { max-width: 1280px; margin: 0 auto; padding: 0 40px; }

          /* Sticky progress bar at top */
          .hiw-progress-bar {
            position: relative;
            height: 5px;
            background: rgba(255,255,255,0.08);
            overflow: hidden;
          }
          .hiw-progress-fill {
            height: 100%;
            width: 0;
            background: linear-gradient(90deg, #ff4500, #ff7c3a, #ff4500);
            background-size: 200% 100%;
            animation: hiwLine 2.8s cubic-bezier(.4,0,.2,1) 0.3s forwards;
          }

          /* Header area */
          .hiw-header {
            text-align: center;
            padding: 80px 40px 60px;
            max-width: 1280px;
            margin: 0 auto;
          }
          .hiw-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 999px;
            background: rgba(255,69,0,0.18);
            color: #ff7c3a;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 20px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-main-title {
            font-size: 48px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.03em;
            color: #fff;
            margin: 0 0 16px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-main-title span { color: #ff7c3a; }
          .hiw-main-copy {
            font-size: 17px;
            color: rgba(255,255,255,0.6);
            line-height: 1.65;
            margin: 0;
            font-family: 'Space Grotesk', sans-serif;
          }

          /* Individual step row */
          .hiw-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 0;
            min-height: 520px;
            position: relative;
            opacity: 0;
            animation: fadeUp 0.8s cubic-bezier(.34,1.2,.64,1) forwards;
          }
          .hiw-row:nth-child(2) { animation-delay: 0.1s; }
          .hiw-row:nth-child(3) { animation-delay: 0.25s; }
          .hiw-row:nth-child(4) { animation-delay: 0.4s; }
          .hiw-row:nth-child(5) { animation-delay: 0.55s; }

          /* Text side */
          .hiw-text {
            padding: 64px 56px;
            position: relative;
            z-index: 1;
          }
          .hiw-step-label {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #ff7c3a;
            margin-bottom: 12px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-title {
            font-size: 36px;
            font-weight: 800;
            line-height: 1.12;
            letter-spacing: -0.02em;
            color: #fff;
            margin: 0 0 16px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-copy {
            font-size: 16px;
            line-height: 1.7;
            color: rgba(255,255,255,0.65);
            margin: 0 0 28px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: #ff4500;
            color: #fff;
            border-radius: 999px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            transition: background 0.2s, transform 0.2s;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-btn:hover { background: #e03d00; transform: scale(1.03); }

          /* Image side */
          .hiw-img-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px 40px;
            position: relative;
            z-index: 1;
          }
          .hiw-img-circle {
            width: 360px;
            height: 360px;
            border-radius: 50%;
            overflow: hidden;
            border: 5px solid rgba(255,69,0,0.35);
            box-shadow: 0 0 0 16px rgba(255,69,0,0.08), 0 32px 80px rgba(0,0,0,0.4);
            flex-shrink: 0;
          }
          .hiw-img-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }



          @media (max-width: 860px) {
            .hiw-row { grid-template-columns: 1fr; min-height: auto; }
            .hiw-row.hiw-reverse .hiw-text  { order: 2; }
            .hiw-row.hiw-reverse .hiw-img-wrap { order: 1; }
            .hiw-text { padding: 40px 24px 24px; }
            .hiw-img-wrap { padding: 24px; }
            .hiw-img-circle { width: 260px; height: 260px; }
            .hiw-main-title { font-size: 32px; }
            .hiw-step-title { font-size: 26px; }
            .hiw-header { padding: 60px 24px 40px; }
          }
        `}} />

        {/* Animated orange progress line */}
        <div className="hiw-progress-bar">
          <div className="hiw-progress-fill" />
        </div>

        {/* Section header */}
        <div className="hiw-header">
          <div className="hiw-eyebrow">How It Works</div>
          <h2 className="hiw-main-title">
            Book the right service in <span>four simple steps</span>
          </h2>
          <p className="hiw-main-copy">
            A straightforward flow designed to help clients discover, compare, and hire with confidence.
          </p>
        </div>

        {/* ── Step 1: Search ── */}
        <div className="hiw-row hiw-reverse">
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step1.png" alt="Search for services" />
            </div>
          </div>
          <div className="hiw-text">
            <div className="hiw-step-label">Step 1</div>
            <h3 className="hiw-step-title">Search &amp; Filter Services</h3>
            <p className="hiw-step-copy">
              Enter the service you need, pick a category, and set your location. Our smart search instantly surfaces the most relevant professionals near you.
            </p>
            <a href="/search" className="hiw-step-btn">
              Browse services <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
        </div>

        {/* ── Step 2: Compare ── */}
        <div className="hiw-row">
          <div className="hiw-text">
            <div className="hiw-step-label">Step 2</div>
            <h3 className="hiw-step-title">Compare Verified Profiles</h3>
            <p className="hiw-step-copy">
              Review ratings, experience, response times, and pricing. Every professional on Boulot Man is verified — so you always hire with confidence.
            </p>
            <a href="/search" className="hiw-step-btn">
              View professionals <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step2.png" alt="Compare verified profiles" />
            </div>
          </div>
        </div>

        {/* ── Step 3: Book ── */}
        <div className="hiw-row hiw-reverse">
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step3.png" alt="Book and schedule" />
            </div>
          </div>
          <div className="hiw-text">
            <div className="hiw-step-label">Step 3</div>
            <h3 className="hiw-step-title">Book &amp; Schedule</h3>
            <p className="hiw-step-copy">
              Contact the professional, confirm the schedule, and lock in your appointment — all from one place. No back-and-forth calls needed.
            </p>
            <a href="/signup" className="hiw-step-btn">
              Get started <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
        </div>

        {/* ── Step 4: Done ── */}
        <div className="hiw-row">
          <div className="hiw-text">
            <div className="hiw-step-label">Step 4</div>
            <h3 className="hiw-step-title">Sit Back &amp; Get It Done</h3>
            <p className="hiw-step-copy">
              Your professional arrives on time, completes the job to a high standard, and you leave a review. It's that simple — quality service, every time.
            </p>
            <a href="/signup" className="hiw-step-btn">
              Hire now <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step4.png" alt="Job completed" />
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

      {/* ====== COUNTRIES SECTION ====== */}
      <section id="countries-section" className="section">
        <style dangerouslySetInnerHTML={{ __html: `
          #countries-section {
            background: #0F172A;
            padding: 80px 0;
          }
          .countries-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 69, 0, 0.12);
            color: #ff4500;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 8px 16px;
            border-radius: 999px;
            margin-bottom: 16px;
          }
          .countries-header {
            text-align: center;
            margin-bottom: 52px;
          }
          .countries-header h2 {
            font-size: 44px;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 12px;
            line-height: 1.1;
          }
          .countries-header h2 span {
            color: #ff4500;
          }
          .countries-header p {
            color: #64748b;
            font-size: 17px;
            max-width: 520px;
            margin: 0 auto;
          }
          .countries-grid {
            display: flex;
            gap: 12px;
            height: 480px;
            align-items: stretch;
          }
          .country-card-exp {
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            cursor: pointer;
            flex: 1;
            min-width: 0;
            transition: flex 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .country-card-exp:hover {
            flex: 4;
          }
          .country-card-exp img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .country-card-exp:hover img {
            transform: scale(1.06);
          }
          .country-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
            transition: background 0.5s ease;
          }
          .country-card-exp:hover .country-card-overlay {
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
          }
          .country-card-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 28px 24px;
            color: #fff;
          }
          .country-card-flag {
            font-size: 32px;
            margin-bottom: 8px;
            display: block;
          }
          .country-card-name {
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .country-card-desc {
            font-size: 14px;
            color: rgba(255,255,255,0.8);
            margin: 0 0 16px;
            line-height: 1.5;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.5s ease, opacity 0.4s ease;
          }
          .country-card-exp:hover .country-card-desc {
            max-height: 80px;
            opacity: 1;
          }
          .country-card-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #ff4500;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            padding: 10px 20px;
            border-radius: 999px;
            text-decoration: none;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
          }
          .country-card-exp:hover .country-card-link {
            opacity: 1;
            transform: translateY(0);
          }
          .country-card-link:hover {
            background: #e03d00;
          }
          @media (max-width: 768px) {
            .countries-grid {
              flex-direction: column;
              height: auto;
            }
            .country-card-exp {
              flex: none !important;
              height: 200px;
            }
            .country-card-exp:hover {
              height: 300px;
            }
            .country-card-desc { max-height: 60px; opacity: 1; }
            .country-card-link { opacity: 1; transform: none; }
          }
        `}} />
        <div className="container">
          <div className="countries-header">
            <div className="countries-eyebrow">🌍 Our Reach</div>
            <h2>Where We <span>Operate</span></h2>
            <p>Boulot Man connects clients and professionals across Africa and beyond.</p>
          </div>
          <div className="countries-grid">
            {[
              {
                name: "Rwanda",
                flag: "🇷🇼",
                img: "/rwanda.jpg",
                desc: "Kigali's fastest-growing tech and service market — clean, connected, and opportunity-rich."
              },
              {
                name: "Kenya",
                flag: "🇰🇪",
                img: "/kenya.jpg",
                desc: "Nairobi's dynamic economy drives demand for top-tier professionals across every industry."
              },
              {
                name: "Nigeria",
                flag: "🇳🇬",
                img: "/nigeria.jpg",
                desc: "Africa's largest economy with millions of skilled professionals ready to deliver."
              },
              {
                name: "Ghana",
                flag: "🇬🇭",
                img: "/ghana.jpg",
                desc: "Accra's thriving business hub where talent meets opportunity every day."
              },
              {
                name: "South Africa",
                flag: "🇿🇦",
                img: "/south-africa.jpg",
                desc: "Cape Town and Johannesburg — Africa's most developed professional service markets."
              },
              {
                name: "Global",
                flag: "🌐",
                img: "/global.jpg",
                desc: "Remote-ready professionals available worldwide — no borders, just results."
              },
            ].map((country) => (
              <div key={country.name} className="country-card-exp">
                <img src={country.img} alt={country.name} />
                <div className="country-card-overlay" />
                <div className="country-card-info">
                  <span className="country-card-flag">{country.flag}</span>
                  <h3 className="country-card-name">{country.name}</h3>
                  <p className="country-card-desc">{country.desc}</p>
                  <a href="/search" className="country-card-link">
                    Explore {country.name} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ====== END COUNTRIES SECTION ====== */}

      <section id="interactive-testimonials" className="section" style={{ paddingTop: 0 }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .floating-testimonials-area {
            position: relative;
            width: 100%;
            min-height: 600px;
            background: var(--background);
            overflow: hidden;
            margin: 48px 0;
            border-radius: 32px;
          }
          .testimonial-bubble {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid #001F3F;
            box-shadow: 0 10px 25px rgba(0, 31, 63, 0.1);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 2;
            background: #f1f5f9;
          }
          .testimonial-bubble img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          .testimonial-bubble:hover {
            transform: scale(1.1);
            border-color: #ea580c;
            z-index: 10;
            box-shadow: 0 15px 35px rgba(234, 88, 12, 0.3);
          }
          .testimonial-dropdown-card {
            position: absolute;
            top: 130px;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            width: 320px;
            background: #fff;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 20px 50px rgba(0, 31, 63, 0.15);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: -1;
            text-align: center;
          }
          .testimonial-dropdown-card::before {
            content: "";
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 10px 10px 10px;
            border-style: solid;
            border-color: transparent transparent #fff transparent;
          }
          .testimonial-bubble:hover .testimonial-dropdown-card {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateX(-50%) translateY(0);
          }
          .testi-quote-icon {
            color: #ea580c;
            font-size: 24px;
            margin-bottom: 12px;
          }
          .testi-text {
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
            margin: 0 0 16px;
            font-weight: 500;
          }
          .testi-author {
            font-weight: 800;
            font-size: 16px;
            color: #0f172a;
            margin: 0;
          }
          .testi-role {
            font-size: 13px;
            color: #64748b;
            margin: 4px 0 12px;
          }
          .testi-stars {
            color: #fbbf24;
            font-size: 16px;
            display: flex;
            justify-content: center;
            gap: 4px;
          }
          .tb-1 { top: 20%; left: 10%; }
          .tb-2 { top: 60%; left: 30%; }
          .tb-3 { top: 15%; left: 50%; transform: translateX(-50%); }
          .tb-4 { top: 60%; right: 30%; }
          .tb-5 { top: 25%; right: 10%; }
          
          /* Make bottom bubbles open upwards so they don't get clipped */
          .tb-2 .testimonial-dropdown-card,
          .tb-4 .testimonial-dropdown-card {
            top: auto;
            bottom: 135px;
          }
          .tb-2 .testimonial-dropdown-card::before,
          .tb-4 .testimonial-dropdown-card::before {
            top: auto;
            bottom: -10px;
            border-width: 10px 10px 0 10px;
            border-color: #fff transparent transparent transparent;
          }
          
          .testimonial-bubble.tb-3:hover {
            transform: translateX(-50%) scale(1.1);
          }
          .testimonial-bubble.tb-3 .testimonial-dropdown-card {
            /* Fix for the centered one */
            transform: translateX(-50%) translateY(10px);
          }
          .testimonial-bubble.tb-3:hover .testimonial-dropdown-card {
            transform: translateX(-50%) translateY(0);
          }
          
          @media (max-width: 1200px) {
            .tb-1 { left: 5%; }
            .tb-2 { left: 20%; }
            .tb-4 { right: 20%; }
            .tb-5 { right: 5%; }
          }
          @media (max-width: 768px) {
            .floating-testimonials-area {
              min-height: auto;
              display: flex;
              flex-direction: column;
              gap: 24px;
              padding: 24px 0;
              overflow: visible;
            }
            .testimonial-bubble {
              position: relative;
              top: auto !important;
              left: auto !important;
              right: auto !important;
              bottom: auto !important;
              width: 100% !important;
              height: auto !important;
              border: none;
              border-radius: 20px;
              box-shadow: 0 10px 25px rgba(0, 31, 63, 0.05);
              padding: 24px;
              background: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .testimonial-bubble img {
              width: 80px;
              height: 80px;
              margin-bottom: 16px;
            }
            .testimonial-dropdown-card {
              position: relative;
              top: auto;
              left: auto;
              transform: none !important;
              width: 100%;
              opacity: 1;
              visibility: visible;
              pointer-events: auto;
              box-shadow: none;
              padding: 0;
              background: transparent;
              z-index: 1;
            }
            .testimonial-dropdown-card::before {
              display: none;
            }
          }
        `}} />
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Success Stories</div>
            <h2 className="section-title">See why people trust Boulot Man</h2>
            <p className="section-copy">
              Discover how we've helped companies and individuals across Africa find perfect, vetted professionals they can rely on.
            </p>
          </div>

          <div className="floating-testimonials-area">
            {/* Bubble 1 */}
            <div className="testimonial-bubble tb-1">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60" alt="Client 1" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "Finding reliable IT infrastructure experts in Lagos used to take weeks. With Boulot Man, we had a vetted professional on-site within 48 hours."
                </p>
                <h4 className="testi-author">Ngozi O.</h4>
                <p className="testi-role">Operations Manager</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>

            {/* Bubble 2 */}
            <div className="testimonial-bubble tb-2">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60" alt="Client 2" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "Our engineering firm relies on specialized talent. The talent pool here is unmatched, and the escrow system makes payments worry-free."
                </p>
                <h4 className="testi-author">Adebayo A.</h4>
                <p className="testi-role">Lead Engineer</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>

            {/* Bubble 3 */}
            <div className="testimonial-bubble tb-3">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60" alt="Client 3" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "I needed an expert to handle my home automation system. The technician I hired was extremely professional and knew exactly what to do."
                </p>
                <h4 className="testi-author">David S.</h4>
                <p className="testi-role">Homeowner</p>
                <div className="testi-stars">★★★★☆</div>
              </div>
            </div>

            {/* Bubble 4 */}
            <div className="testimonial-bubble tb-4">
              <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=500&auto=format&fit=crop&q=60" alt="Client 4" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "Outstanding platform! The vetting process gave me confidence, and the results exceeded my expectations."
                </p>
                <h4 className="testi-author">Chidinma E.</h4>
                <p className="testi-role">Creative Director</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>

            {/* Bubble 5 */}
            <div className="testimonial-bubble tb-5">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60" alt="Client 5" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "We've hired multiple contractors for civil works through Boulot Man. The tracking and milestone payments keep everything transparent."
                </p>
                <h4 className="testi-author">Olamide O.</h4>
                <p className="testi-role">Project Manager</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
