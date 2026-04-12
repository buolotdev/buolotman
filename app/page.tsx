import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
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
                  Find trusted professionals for any job
                </h1>
                <p className="hero-copy">
                  Hire skilled technicians, compare verified companies, and book
                  reliable help in minutes. From quick repairs to ongoing
                  business projects, Boulot Man helps you move faster.
                </p>


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
                        <div className="icon-wrap" style={{ fontSize: '24px' }}>
                          <iconify-icon icon="lucide:wrench"></iconify-icon>
                        </div>
                      </div>
                      <div>
                        <p className="dash-name">FastFix Electrical</p>
                        <p className="dash-meta">Emergency wiring • 4.9 rating</p>
                      </div>
                      <div className="dash-price">From 18,000 XOF</div>
                    </div>

                    <div className="dash-item" data-media-type="banani-button">
                      <div className="dash-thumb">
                        <div className="icon-wrap" style={{ fontSize: '24px' }}>
                          <iconify-icon
                            icon="lucide:paint-roller"
                          ></iconify-icon>
                        </div>
                      </div>
                      <div>
                        <p className="dash-name">Elite Paint Studio</p>
                        <p className="dash-meta">Interior finishing • 120 jobs</p>
                      </div>
                      <div className="dash-price">From 35,000 XOF</div>
                    </div>

                    <div className="dash-item" data-media-type="banani-button">
                      <div className="dash-thumb">
                        <div className="icon-wrap" style={{ fontSize: '24px' }}>
                          <iconify-icon icon="lucide:hammer"></iconify-icon>
                        </div>
                      </div>
                      <div>
                        <p className="dash-name">BuildPro Services</p>
                        <p className="dash-meta">
                          Repairs and renovation • 2 hrs away
                        </p>
                      </div>
                      <div className="dash-price">From 25,000 XOF</div>
                    </div>
                  </div>

                  <div className="hero-stats">
                    <div className="hero-stat">
                      <p className="hero-stat-value">12k+</p>
                      <p className="hero-stat-label">Professionals listed</p>
                    </div>
                    <div className="hero-stat">
                      <p className="hero-stat-value">4.9/5</p>
                      <p className="hero-stat-label">Average client rating</p>
                    </div>
                    <div className="hero-stat">
                      <p className="hero-stat-value">24 hrs</p>
                      <p className="hero-stat-label">Average response time</p>
                    </div>
                  </div>
                </div>
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
              <a className="btn btn-secondary" data-media-type="banani-button"
                >View all
                <div
                  className="icon-wrap"
                  style={{ fontSize: '16px', width: '16px', height: '16px' }}
                >
                  <iconify-icon icon="lucide:arrow-right"></iconify-icon></div
              ></a>
            </div>

            <div className="categories-grid">
              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:wrench"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">Plumbing</h3>
                <p className="category-copy">
                  Leak fixes, pipe installation, bathroom repairs, and
                  maintenance.
                </p>
                <div className="category-count">860 technicians</div>
              </div>

              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:zap"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">Electrical</h3>
                <p className="category-copy">
                  Wiring, lighting upgrades, troubleshooting, and emergency
                  service.
                </p>
                <div className="category-count">1,120 technicians</div>
              </div>

              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:paint-roller"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">Painting</h3>
                <p className="category-copy">
                  Interior refresh, exterior painting, finishing, and coating
                  work.
                </p>
                <div className="category-count">540 specialists</div>
              </div>

              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:sofa"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">Cleaning</h3>
                <p className="category-copy">
                  Home, office, move-out, and deep cleaning professionals.
                </p>
                <div className="category-count">730 teams</div>
              </div>

              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:hammer"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">Carpentry</h3>
                <p className="category-copy">
                  Custom furniture, repairs, door fitting, and woodwork
                  services.
                </p>
                <div className="category-count">420 specialists</div>
              </div>

              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:fan"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">HVAC Repair</h3>
                <p className="category-copy">
                  Air conditioning installation, maintenance, and ventilation
                  setup.
                </p>
                <div className="category-count">380 technicians</div>
              </div>

              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:flower-2"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">Gardening</h3>
                <p className="category-copy">
                  Lawn care, landscaping, tree trimming, and outdoor
                  maintenance.
                </p>
                <div className="category-count">210 teams</div>
              </div>

              <div className="card category-card" data-media-type="banani-button">
                <div className="category-icon">
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon icon="lucide:truck"></iconify-icon>
                  </div>
                </div>
                <h3 className="category-title">Moving Services</h3>
                <p className="category-copy">
                  Residential and commercial relocation, packing, and heavy
                  lifting.
                </p>
                <div className="category-count">340 companies</div>
              </div>
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
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
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
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
                    <iconify-icon
                      icon="lucide:badge-dollar-sign"
                    ></iconify-icon>
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
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
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
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
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
              <a className="btn btn-secondary" data-media-type="banani-button"
                >See all technicians
                <div
                  className="icon-wrap"
                  style={{ fontSize: '16px', width: '16px', height: '16px' }}
                >
                  <iconify-icon icon="lucide:arrow-right"></iconify-icon></div
              ></a>
            </div>

            <div className="profile-grid">
              <div className="card profile-card" data-media-type="banani-button">
                <div className="profile-top">
                  <img
                    className="profile-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FAfrican%2F2"
                    alt="Moussa Traoré"
                  />
                  <div style={{ minWidth: '0' }}>
                    <p className="profile-name">Moussa Traoré</p>
                    <p className="profile-role">Master electrician</p>
                  </div>
                </div>
                <div className="chips">
                  <div className="chip">Same-day booking</div>
                  <div className="chip">Certified</div>
                </div>
                <div className="profile-footer">
                  <div className="rating-row">
                    <div
                      className="icon-wrap"
                      style={{ fontSize: '18px', width: '18px', height: '18px', color: 'var(--accent)' }}
                    >
                      <iconify-icon icon="lucide:star"></iconify-icon>
                    </div>
                    <span>4.9</span>
                    <span className="subtle">218 jobs</span>
                  </div>
                  <div className="rating-row">
                    18,000 XOF <span className="subtle">/ visit</span>
                  </div>
                </div>
              </div>

              <div className="card profile-card" data-media-type="banani-button">
                <div className="profile-top">
                  <img
                    className="profile-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAfrican%2F4"
                    alt="Aminata Koné"
                  />
                  <div style={{ minWidth: '0' }}>
                    <p className="profile-name">Aminata Koné</p>
                    <p className="profile-role">Interior painter</p>
                  </div>
                </div>
                <div className="chips">
                  <div className="chip">5+ years experience</div>
                  <div className="chip">Insured</div>
                </div>
                <div className="profile-footer">
                  <div className="rating-row">
                    <div
                      className="icon-wrap"
                      style={{ fontSize: '18px', width: '18px', height: '18px', color: 'var(--accent)' }}
                    >
                      <iconify-icon icon="lucide:star"></iconify-icon>
                    </div>
                    <span>4.8</span>
                    <span className="subtle">164 jobs</span>
                  </div>
                  <div className="rating-row">
                    25,000 XOF <span className="subtle">/ project</span>
                  </div>
                </div>
              </div>

              <div className="card profile-card" data-media-type="banani-button">
                <div className="profile-top">
                  <img
                    className="profile-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FAfrican%2F1"
                    alt="Serge Yao"
                  />
                  <div style={{ minWidth: '0' }}>
                    <p className="profile-name">Serge Yao</p>
                    <p className="profile-role">Facility technician</p>
                  </div>
                </div>
                <div className="chips">
                  <div className="chip">Business support</div>
                  <div className="chip">Verified ID</div>
                </div>
                <div className="profile-footer">
                  <div className="rating-row">
                    <div
                      className="icon-wrap"
                      style={{ fontSize: '18px', width: '18px', height: '18px', color: 'var(--accent)' }}
                    >
                      <iconify-icon icon="lucide:star"></iconify-icon>
                    </div>
                    <span>4.9</span>
                    <span className="subtle">302 jobs</span>
                  </div>
                  <div className="rating-row">
                    30,000 XOF <span className="subtle">/ day</span>
                  </div>
                </div>
              </div>

              <div className="card profile-card" data-media-type="banani-button">
                <div className="profile-top">
                  <img
                    className="profile-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FAfrican%2F2"
                    alt="Awa Diop"
                  />
                  <div style={{ minWidth: '0' }}>
                    <p className="profile-name">Awa Diop</p>
                    <p className="profile-role">Professional cleaner</p>
                  </div>
                </div>
                <div className="chips">
                  <div className="chip">Deep cleaning</div>
                  <div className="chip">Top rated</div>
                </div>
                <div className="profile-footer">
                  <div className="rating-row">
                    <div
                      className="icon-wrap"
                      style={{ fontSize: '18px', width: '18px', height: '18px', color: 'var(--accent)' }}
                    >
                      <iconify-icon icon="lucide:star"></iconify-icon>
                    </div>
                    <span>5.0</span>
                    <span className="subtle">95 jobs</span>
                  </div>
                  <div className="rating-row">
                    15,000 XOF <span className="subtle">/ visit</span>
                  </div>
                </div>
              </div>

              <div className="card profile-card" data-media-type="banani-button">
                <div className="profile-top">
                  <img
                    className="profile-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FAfrican%2F3"
                    alt="Kofi Mensah"
                  />
                  <div style={{ minWidth: '0' }}>
                    <p className="profile-name">Kofi Mensah</p>
                    <p className="profile-role">HVAC Specialist</p>
                  </div>
                </div>
                <div className="chips">
                  <div className="chip">AC Repair</div>
                  <div className="chip">Certified</div>
                </div>
                <div className="profile-footer">
                  <div className="rating-row">
                    <div
                      className="icon-wrap"
                      style={{ fontSize: '18px', width: '18px', height: '18px', color: 'var(--accent)' }}
                    >
                      <iconify-icon icon="lucide:star"></iconify-icon>
                    </div>
                    <span>4.7</span>
                    <span className="subtle">142 jobs</span>
                  </div>
                  <div className="rating-row">
                    20,000 XOF <span className="subtle">/ repair</span>
                  </div>
                </div>
              </div>

              <div className="card profile-card" data-media-type="banani-button">
                <div className="profile-top">
                  <img
                    className="profile-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FAfrican%2F2"
                    alt="Jean-Paul K."
                  />
                  <div style={{ minWidth: '0' }}>
                    <p className="profile-name">Jean-Paul K.</p>
                    <p className="profile-role">Master Carpenter</p>
                  </div>
                </div>
                <div className="chips">
                  <div className="chip">Custom Furniture</div>
                  <div className="chip">10+ yrs exp</div>
                </div>
                <div className="profile-footer">
                  <div className="rating-row">
                    <div
                      className="icon-wrap"
                      style={{ fontSize: '18px', width: '18px', height: '18px', color: 'var(--accent)' }}
                    >
                      <iconify-icon icon="lucide:star"></iconify-icon>
                    </div>
                    <span>4.9</span>
                    <span className="subtle">275 jobs</span>
                  </div>
                  <div className="rating-row">
                    40,000 XOF <span className="subtle">/ project</span>
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
              <a className="btn btn-secondary" data-media-type="banani-button"
                >View all companies
                <div
                  className="icon-wrap"
                  style={{ fontSize: '16px', width: '16px', height: '16px' }}
                >
                  <iconify-icon icon="lucide:arrow-right"></iconify-icon></div
              ></a>
            </div>

            <div className="company-grid">
              <div className="card company-card" data-media-type="banani-button">
                <div className="company-head">
                  <div className="company-mark">
                    <div className="icon-wrap" style={{ fontSize: '24px' }}>
                      <iconify-icon icon="lucide:building-2"></iconify-icon>
                    </div>
                  </div>
                  <div>
                    <p className="company-name">UrbanWorks Pro</p>
                    <p className="company-meta">Maintenance company • Abidjan</p>
                  </div>
                </div>
                <p className="company-copy">
                  Reliable office maintenance, electrical upgrades, and
                  preventive support for modern workplaces.
                </p>
                <div className="company-stats">
                  <div className="company-stat">
                    <strong>230+</strong><span>Projects</span>
                  </div>
                  <div className="company-stat">
                    <strong>4.8</strong><span>Rating</span>
                  </div>
                  <div className="company-stat">
                    <strong>18</strong><span>Staff</span>
                  </div>
                </div>
              </div>

              <div className="card company-card" data-media-type="banani-button">
                <div className="company-head">
                  <div className="company-mark">
                    <div className="icon-wrap" style={{ fontSize: '24px' }}>
                      <iconify-icon icon="lucide:warehouse"></iconify-icon>
                    </div>
                  </div>
                  <div>
                    <p className="company-name">Nova Clean Group</p>
                    <p className="company-meta">Cleaning partner • Yamoussoukro</p>
                  </div>
                </div>
                <p className="company-copy">
                  Scalable cleaning teams for offices, residential compounds,
                  and post-construction handovers.
                </p>
                <div className="company-stats">
                  <div className="company-stat">
                    <strong>410+</strong><span>Contracts</span>
                  </div>
                  <div className="company-stat">
                    <strong>4.9</strong><span>Rating</span>
                  </div>
                  <div className="company-stat">
                    <strong>36</strong><span>Staff</span>
                  </div>
                </div>
              </div>

              <div className="card company-card" data-media-type="banani-button">
                <div className="company-head">
                  <div className="company-mark">
                    <div className="icon-wrap" style={{ fontSize: '24px' }}>
                      <iconify-icon icon="lucide:hard-hat"></iconify-icon>
                    </div>
                  </div>
                  <div>
                    <p className="company-name">Bati Excellence</p>
                    <p className="company-meta">Construction team • Bouaké</p>
                  </div>
                </div>
                <p className="company-copy">
                  Experienced crews for renovation, finishing, painting, and
                  multi-site commercial improvements.
                </p>
                <div className="company-stats">
                  <div className="company-stat">
                    <strong>125+</strong><span>Projects</span>
                  </div>
                  <div className="company-stat">
                    <strong>4.7</strong><span>Rating</span>
                  </div>
                  <div className="company-stat">
                    <strong>24</strong><span>Staff</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="section">
          <div className="container">
            <div className="section-header">
              <div className="eyebrow">Client Testimonials</div>
              <h2 className="section-title">What our users say</h2>
              <p className="section-copy">
                Thousands of clients and professionals trust Boulot Man
                everyday.
              </p>
            </div>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="stars">
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                </div>
                <p className="testimonial-text">
                  &quot;Boulot Man made finding a reliable plumber so easy. The
                  technician arrived on time and fixed the issue perfectly.
                  Highly recommended!&quot;
                </p>
                <div className="testimonial-author">
                  <img
                    className="author-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAfrican%2F1"
                    alt="Fatou S."
                  />
                  <div className="author-info">
                    <p className="author-name">Fatou S.</p>
                    <p className="author-role">Homeowner</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="stars">
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                </div>
                <p className="testimonial-text">
                  &quot;We use the platform to find maintenance staff for our office
                  building. It&apos;s incredibly efficient and the professionals are
                  top-notch.&quot;
                </p>
                <div className="testimonial-author">
                  <img
                    className="author-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FAfrican%2F3"
                    alt="Marc A."
                  />
                  <div className="author-info">
                    <p className="author-name">Marc A.</p>
                    <p className="author-role">Office Manager</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="stars">
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                  <div
                    className="icon-wrap"
                    style={{ fontSize: '18px', width: '18px', height: '18px' }}
                  >
                    <iconify-icon icon="lucide:star"></iconify-icon>
                  </div>
                </div>
                <p className="testimonial-text">
                  &quot;As a freelancer, this platform has transformed my business. I
                  get consistent work and the payment process is seamless. Best
                  app for workers!&quot;
                </p>
                <div className="testimonial-author">
                  <img
                    className="author-avatar"
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FAfrican%2F5"
                    alt="Ibrahim Touré"
                  />
                  <div className="author-info">
                    <p className="author-name">Ibrahim Touré</p>
                    <p className="author-role">Independent Electrician</p>
                  </div>
                </div>
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
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
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
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
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
                  <div className="icon-wrap" style={{ fontSize: '28px' }}>
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
                  Join thousands of clients, freelancers, and companies using
                  Boulot Man to connect with trusted service opportunities every
                  day.
                </p>
              </div>
              <div className="cta-actions">
                <a className="btn btn-secondary" data-media-type="banani-button"
                  >Browse services</a
                >
                <a className="btn btn-primary" data-media-type="banani-button"
                  >Get started</a
                >
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
  );
}
