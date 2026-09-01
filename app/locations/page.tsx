"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./locations.module.css";

interface LocationCardData {
  id: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flagUrl: string;
  status: "live" | "coming";
  copy: string;
  dialCode: string;
  currency: string;
  providers: string;
  projectSupport: string;
  services: string[];
  searchKeywords: string;
}

const ACTIVE_LOCATIONS: LocationCardData[] = [
  {
    id: "douala",
    city: "Douala",
    region: "Littoral Region",
    country: "cameroon",
    countryCode: "Cameroon",
    flagUrl: "https://flagcdn.com/w80/cm.png",
    status: "live",
    copy: "Find local technicians, engineering professionals, service companies and project teams serving homes, businesses and construction projects across Douala.",
    dialCode: "+237",
    currency: "XAF · FCFA",
    providers: "Technicians & Companies",
    projectSupport: "Available",
    services: ["Construction", "Electrical", "Plumbing", "Repairs", "IT"],
    searchKeywords: "douala cameroon littoral technicians engineers companies electrical plumbing"
  },
  {
    id: "yaounde",
    city: "Yaoundé",
    region: "Centre Region",
    country: "cameroon",
    countryCode: "Cameroon",
    flagUrl: "https://flagcdn.com/w80/cm.png",
    status: "live",
    copy: "Access technicians, engineers and companies for residential, commercial, technical and project work throughout Yaoundé and surrounding areas.",
    dialCode: "+237",
    currency: "XAF · FCFA",
    providers: "Technicians & Companies",
    projectSupport: "Available",
    services: ["Construction", "Electrical", "Maintenance", "Engineering", "Technology"],
    searchKeywords: "yaoundé yaounde cameroon centre technicians engineers companies"
  },
  {
    id: "kigali",
    city: "Kigali",
    region: "Kigali City",
    country: "rwanda",
    countryCode: "Rwanda",
    flagUrl: "https://flagcdn.com/w80/rw.png",
    status: "live",
    copy: "Connect with verified technical professionals, engineering specialists and companies for service requests and structured projects across Kigali.",
    dialCode: "+250",
    currency: "RWF · FRw",
    providers: "Professionals & Companies",
    projectSupport: "Available",
    services: ["Construction", "Electrical", "Plumbing", "IT", "Engineering"],
    searchKeywords: "kigali rwanda technicians engineers companies solar it"
  }
];

const EXPANSION_MARKETS = [
  {
    country: "Nigeria",
    city: "Lagos",
    flag: "https://flagcdn.com/w80/ng.png",
    copy: "Preparing a broader professional and company network for one of Africa's largest service markets."
  },
  {
    country: "Ivory Coast",
    city: "Abidjan",
    flag: "https://flagcdn.com/w80/ci.png",
    copy: "Building access to technical professionals and companies across construction, maintenance and engineering services."
  },
  {
    country: "Ghana",
    city: "Accra",
    flag: "https://flagcdn.com/w80/gh.png",
    copy: "Developing local provider coverage for residential, commercial and technical project requirements."
  },
  {
    country: "Kenya",
    city: "Nairobi",
    flag: "https://flagcdn.com/w80/ke.png",
    copy: "Preparing skilled-service, technology, engineering and enterprise project networks."
  },
  {
    country: "Tanzania",
    city: "Dar es Salaam",
    flag: "https://flagcdn.com/w80/tz.png",
    copy: "Growing provider capacity around skilled services, construction and technical project delivery."
  },
  {
    country: "South Africa",
    city: "Johannesburg",
    flag: "https://flagcdn.com/w80/za.png",
    copy: "Preparing enterprise, professional and technical service networks for broader marketplace coverage."
  }
];

const HOW_LOCATION_WORKS = [
  {
    num: "1",
    title: "Choose Your Location",
    description: "Select your country and city when creating a request, searching for professionals or browsing companies."
  },
  {
    num: "2",
    title: "See Relevant Providers",
    description: "Search results prioritize providers who operate in or near your selected local market or project site."
  },
  {
    num: "3",
    title: "Compare Availability",
    description: "Review experience, verification, service categories, distance and availability before hiring."
  },
  {
    num: "4",
    title: "Hire Locally",
    description: "Send a service request, post a task, request a quotation or create a larger managed project."
  }
];

const LOCAL_SERVICES = [
  {
    num: "01",
    title: "Verified Professionals",
    description: "Browse technicians, engineers and skilled professionals available within your local market."
  },
  {
    num: "02",
    title: "Verified Companies",
    description: "Find registered companies for larger assignments, quotations and specialized project work."
  },
  {
    num: "03",
    title: "Tasks & Service Requests",
    description: "Post work locally and connect with providers who can respond based on category and location."
  },
  {
    num: "04",
    title: "Larger Projects",
    description: "Access Boulot Man Contractors, Enterprise Projects, Build a Team and other structured project services."
  }
];

export default function LocationsPage() {
  const [heroSearch, setHeroSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    country: "",
    city: "",
    role: ""
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleHeroQuickClick = (term: string) => {
    setHeroSearch(term);
    setFilterSearch(term);
    const el = document.getElementById("active-locations");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterSearch(heroSearch);
    const el = document.getElementById("active-locations");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredLocations = ACTIVE_LOCATIONS.filter((loc) => {
    const q = filterSearch.trim().toLowerCase();
    const searchMatch =
      !q ||
      loc.city.toLowerCase().includes(q) ||
      loc.countryCode.toLowerCase().includes(q) ||
      loc.region.toLowerCase().includes(q) ||
      loc.searchKeywords.toLowerCase().includes(q);

    const countryMatch = !countryFilter || loc.country === countryFilter;
    const statusMatch = !statusFilter || loc.status === statusFilter;

    return searchMatch && countryMatch && statusMatch;
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* =====================================================
           HERO
      ====================================================== */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.eyebrow}>Boulot Man Across Africa</div>
              <h1>Find Trusted Professionals and Companies in Your City</h1>
              <p className={styles.heroCopy}>
                Explore Boulot Man locations across Africa and connect with verified technicians,
                engineers, professionals and companies available to serve clients in their local markets.
              </p>

              <div className={styles.heroActions}>
                <a href="#active-locations" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Explore Locations
                </a>
                <Link href="/service-providers/technicians" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Find Professionals
                </Link>
              </div>
            </div>

            <aside className={styles.searchCard}>
              <h2>Search your location</h2>
              <p>Search by country or city to see where Boulot Man services are currently available or expanding.</p>

              <form onSubmit={handleHeroSearchSubmit} className={styles.searchField}>
                <input
                  type="search"
                  placeholder="Search city or country..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  autoComplete="off"
                />
                <span className={styles.searchIcon}>⌕</span>
              </form>

              <div className={styles.quickLinks}>
                {["Douala", "Yaoundé", "Kigali", "Nigeria", "Kenya", "Ghana"].map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={styles.quickLink}
                    onClick={() => handleHeroQuickClick(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
           STATUS STRIP
      ====================================================== */}
      <section className={styles.strip}>
        <div className={styles.container}>
          <div className={styles.stripGrid}>
            <div className={styles.stripItem}>
              <strong>3</strong>
              <span>Current core cities</span>
            </div>
            <div className={styles.stripItem}>
              <strong>2</strong>
              <span>Active countries</span>
            </div>
            <div className={styles.stripItem}>
              <strong>6</strong>
              <span>Expansion markets</span>
            </div>
            <div className={styles.stripItem}>
              <strong>Africa</strong>
              <span>Built for cross-border growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           ACTIVE LOCATIONS
      ====================================================== */}
      <section className={styles.section} id="active-locations">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Current locations</div>
              <h2 className={styles.title}>Cities Where Boulot Man Is Building Local Service Networks</h2>
              <p className={styles.copy}>
                Availability varies by service category and provider capacity. Use your location when searching
                to see professionals and companies available in your area.
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className={styles.filterCard}>
            <div className={styles.filterGrid}>
              <div className={styles.field}>
                <label htmlFor="locSearch">Search city or country</label>
                <input
                  type="search"
                  id="locSearch"
                  placeholder="e.g. Douala, Kigali, Cameroon..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="locCountry">Country</label>
                <select
                  id="locCountry"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                >
                  <option value="">All countries</option>
                  <option value="cameroon">Cameroon</option>
                  <option value="rwanda">Rwanda</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="locStatus">Availability</label>
                <select
                  id="locStatus"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="live">Active</option>
                </select>
              </div>

              <button
                type="button"
                className={styles.filterBtn}
                onClick={() => {}}
              >
                Search
              </button>
            </div>
          </div>

          {/* LOCATIONS GRID */}
          <div className={styles.locationsGrid}>
            {filteredLocations.map((loc) => (
              <article key={loc.id} className={styles.locationCard}>
                <div className={styles.cardTop}>
                  <div className={styles.countryRow}>
                    <div className={styles.countryInfo}>
                      <div className={styles.flagBox}>
                        <img src={loc.flagUrl} alt={`${loc.countryCode} flag`} />
                      </div>
                      <span className={styles.countryName}>{loc.countryCode}</span>
                    </div>

                    <span className={`${styles.statusBadge} ${styles.statusLive}`}>
                      Active
                    </span>
                  </div>

                  <h3>{loc.city}</h3>
                  <div className={styles.region}>{loc.region}</div>

                  <p className={styles.cardCopy}>{loc.copy}</p>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span>Country Code</span>
                      <strong>{loc.dialCode}</strong>
                    </div>
                    <div className={styles.detailItem}>
                      <span>Currency</span>
                      <strong>{loc.currency}</strong>
                    </div>
                    <div className={styles.detailItem}>
                      <span>Providers</span>
                      <strong>{loc.providers}</strong>
                    </div>
                    <div className={styles.detailItem}>
                      <span>Project Support</span>
                      <strong>{loc.projectSupport}</strong>
                    </div>
                  </div>

                  <div className={styles.servicesTags}>
                    {loc.services.map((s, sIdx) => (
                      <span key={sIdx} className={styles.serviceTag}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/service-providers/technicians?location=${loc.countryCode}`}>
                    Find Professionals →
                  </Link>
                  <Link href={`/search?type=company&location=${loc.countryCode}`}>
                    Find Companies →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className={styles.searchCard} style={{ textAlign: "center", background: "#ffffff", border: "1px solid #e2e8f0" }}>
              <h3 style={{ color: "#001f3f" }}>No matching active location</h3>
              <p style={{ color: "#64748b" }}>
                Try another city or country, or see our upcoming expansion locations below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
           EXPANSION MARKETS
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Expanding across Africa</div>
              <h2 className={styles.title}>Boulot Man Is Building the Next City Networks</h2>
              <p className={styles.copy}>
                Expansion means onboarding local professionals, verifying companies, building service coverage
                and preparing the marketplace for clients in each new market.
              </p>
            </div>
          </div>

          <div className={styles.comingGrid}>
            {EXPANSION_MARKETS.map((m, idx) => (
              <article key={idx} className={styles.comingCard}>
                <div className={styles.comingFlag}>
                  <img src={m.flag} alt={`${m.country} flag`} />
                </div>
                <span>Expansion Market</span>
                <h3>{m.country}</h3>
                <div className={styles.comingCity}>{m.city}</div>
                <p>{m.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           HOW LOCATION WORKS
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Local matching</div>
              <h2 className={styles.title}>How Boulot Man Uses Location</h2>
              <p className={styles.copy}>
                Location helps make marketplace results more relevant by showing clients providers who can
                realistically serve their city or project area.
              </p>
            </div>
          </div>

          <div className={styles.howGrid}>
            {HOW_LOCATION_WORKS.map((h, idx) => (
              <article key={idx} className={styles.howCard}>
                <div className={styles.howNumber}>{h.num}</div>
                <h3>{h.title}</h3>
                <p>{h.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           SERVICES AVAILABLE
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Local marketplace</div>
              <h2 className={styles.title}>What You Can Access in a Boulot Man City</h2>
            </div>
          </div>

          <div className={styles.serviceGrid}>
            {LOCAL_SERVICES.map((s, idx) => (
              <article key={idx} className={styles.serviceItemCard}>
                <div className={styles.serviceIcon}>{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           REQUEST A CITY FORM
      ====================================================== */}
      <section className={styles.requestSection}>
        <div className={styles.container}>
          <div className={styles.requestGrid}>
            <div className={styles.requestCopy}>
              <h2>Don't See Your City Yet?</h2>
              <p>
                Tell Boulot Man where you need services. Location requests help identify cities with growing
                demand from clients, technicians and companies.
              </p>
              <ul className={styles.requestList}>
                <li>Request a new city</li>
                <li>Register interest as a client</li>
                <li>Join as a technician or engineer</li>
                <li>Register a local company</li>
                <li>Help build local service coverage</li>
              </ul>
            </div>

            <form className={styles.formCard} onSubmit={handleSubmitRequest}>
              <h3>Request Boulot Man in Your City</h3>
              <p>Tell us the location and how you would like to use Boulot Man.</p>

              {requestSubmitted && (
                <div className={styles.successMsg}>
                  <span>✓</span>
                  <span>
                    Your request for {requestForm.city ? `${requestForm.city}, ` : ""}{requestForm.country} has been received!
                  </span>
                </div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="reqName">Your Name</label>
                  <input
                    type="text"
                    id="reqName"
                    required
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reqEmail">Email</label>
                  <input
                    type="email"
                    id="reqEmail"
                    required
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reqCountry">Country</label>
                  <input
                    type="text"
                    id="reqCountry"
                    placeholder="e.g. Senegal, Ivory Coast, Benin"
                    required
                    value={requestForm.country}
                    onChange={(e) => setRequestForm({ ...requestForm, country: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reqCity">City</label>
                  <input
                    type="text"
                    id="reqCity"
                    placeholder="e.g. Dakar, Abidjan, Cotonou"
                    required
                    value={requestForm.city}
                    onChange={(e) => setRequestForm({ ...requestForm, city: e.target.value })}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formFull}`}>
                  <label htmlFor="reqRole">I want to use Boulot Man as</label>
                  <select
                    id="reqRole"
                    required
                    value={requestForm.role}
                    onChange={(e) => setRequestForm({ ...requestForm, role: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Client</option>
                    <option>Technician / Professional</option>
                    <option>Engineer</option>
                    <option>Company</option>
                    <option>Contractor</option>
                    <option>Organization</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Location Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================
           FINAL CTA
      ====================================================== */}
      <section className={styles.finalSection}>
        <div className={styles.container}>
          <div className={styles.finalCard}>
            <div className={styles.finalCopy}>
              <h2>Ready to Find Someone Near You?</h2>
              <p>
                Search verified professionals and companies by service, city and availability across the Boulot Man network.
              </p>
            </div>
            <Link href="/service-providers/technicians" className={`${styles.btn} ${styles.btnPrimary}`}>
              Find Professionals
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
