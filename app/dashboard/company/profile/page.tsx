"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import layoutStyles from "../page.module.css";
import styles from "./profile.module.css";

export default function CompanyProfileDashboard() {
  const [activeNav, setActiveNav] = useState("profile");

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers" },
    { id: "projects", label: "Projects", href: "/dashboard/company/projects", icon: "lucide:briefcase", badge: 12 },
    { id: "teams", label: "Teams", href: "/dashboard/company/teams", icon: "lucide:users" },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", badge: 5 },
    { id: "analytics", label: "Analytics", href: "/dashboard/company/analytics", icon: "lucide:bar-chart-3" },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user" },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings" },
  ];

  return (
    <div className={layoutStyles.layoutWrapper}>
      {/* Sidebar */}
      <aside className={layoutStyles.sidebar}>
        <div className={layoutStyles.sidebarHeader}>
          <Link href="/" className={layoutStyles.brand}>
            <Image 
              src="/boulotman-logo.png" 
              alt="Boulot Man Logo" 
              width={180} 
              height={46} 
              className={layoutStyles.brandImage} 
              priority 
            />
          </Link>
        </div>

        <nav className={layoutStyles.navMenu}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${layoutStyles.navItem} ${activeNav === item.id ? layoutStyles.navItemActive : ""}`}
            >
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
              {item.badge && <span className={layoutStyles.navItemBadge}>{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className={layoutStyles.sidebarFooter}>
          <Link href="/login" className={layoutStyles.logoutButton}>
            <iconify-icon icon="lucide:log-out" />
            <span>Logout</span>
          </Link>
          <p className={layoutStyles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={layoutStyles.mainWrapper}>
        {/* Topbar */}
        <header className={layoutStyles.topbar}>
          <div className={layoutStyles.searchBar}>
            <iconify-icon icon="lucide:search" />
            <input
              type="text"
              placeholder="Search projects, contracts, or team members..."
            />
          </div>

          <div className={layoutStyles.topbarActions}>
            <button type="button" className={layoutStyles.iconBtn}>
              <iconify-icon icon="lucide:bell" />
              <div className={layoutStyles.notificationDot} />
            </button>

            <div className={layoutStyles.companyProfile}>
              <div className={layoutStyles.profileImg}>
                <Image
                  src="/boulotman-logo.png"
                  alt="Company Logo"
                  width={40}
                  height={40}
                />
              </div>
              <div className={layoutStyles.profileInfo}>
                <span className={layoutStyles.profileName}>Apex Construction</span>
                <span className={layoutStyles.profileRole}>Company Account</span>
              </div>
              <iconify-icon icon="lucide:chevron-down" style={{ fontSize: '16px', color: '#64748b' }} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={styles.content}>
          {/* Header Banner & Info */}
          <div className={styles.profileHeaderCard}>
            <div className={styles.profileCover}>
              <button type="button" className={styles.profileCoverAction}>
                <iconify-icon icon="lucide:camera" style={{ fontSize: '16px' }} />
                Edit Cover
              </button>
            </div>

            <div className={styles.profileMainInfo}>
              <div className={styles.profileLogoLarge}>
                <Image
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Apex Construction Logo"
                  width={120}
                  height={120}
                />
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.profileTitleRow}>
                  <div>
                    <h1>Apex Construction</h1>
                    <div className={styles.profileMetaTags}>
                      <div className={styles.ratingBadge}>
                        <iconify-icon icon="lucide:star" style={{ fontSize: '14px' }} />
                        4.9 <span>(124 reviews)</span>
                      </div>
                      <div className={styles.profileMetaTag}>
                        <iconify-icon icon="lucide:map-pin" style={{ fontSize: '16px' }} />
                        Downtown District, NY
                      </div>
                      <div className={styles.profileMetaTag}>
                        <iconify-icon icon="lucide:briefcase" style={{ fontSize: '16px' }} />
                        Commercial & Residential
                      </div>
                      <div className={styles.profileMetaTag}>
                        <iconify-icon icon="lucide:shield-check" style={{ fontSize: '16px', color: '#10b981' }} />
                        <span style={{ color: '#10b981', fontWeight: 500 }}>Verified Company</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.headerActions}>
                    <button type="button" className={styles.btnOutline}>
                      <iconify-icon icon="lucide:external-link" style={{ fontSize: '18px' }} />
                      Public View
                    </button>
                    <Link href="/dashboard/company/profile/edit" className={styles.btnPrimary}>
                      <iconify-icon icon="lucide:pencil" style={{ fontSize: '18px' }}></iconify-icon>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className={styles.profileBody}>
            {/* Left Column (Main Details) */}
            <div className={styles.leftCol}>
              {/* About Section */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>About Company</h2>
                  <div className={styles.sectionAction}>
                    <iconify-icon icon="lucide:pencil" style={{ fontSize: '16px' }} />
                    Edit
                  </div>
                </div>
                <p className={styles.aboutText}>
                  Apex Construction is an industry-leading general contractor
                  providing comprehensive building solutions for both
                  commercial and residential projects. With over 15 years of
                  experience in the region, our team of certified
                  professionals guarantees quality craftsmanship, strict
                  adherence to timelines, and exceptional safety standards.
                  From conceptual design and planning to final execution and
                  finishing, we handle every aspect of construction with
                  unmatched dedication. Our mission is to build lasting
                  structures while maintaining transparent communication with
                  our clients every step of the way.
                </p>
              </div>

              {/* Services Section */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Services Offered</h2>
                  <div className={styles.sectionAction}>
                    <iconify-icon icon="lucide:plus" style={{ fontSize: '16px' }} />
                    Add Service
                  </div>
                </div>
                <div className={styles.servicesGrid}>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceIcon}>
                      <iconify-icon icon="lucide:hammer" style={{ fontSize: '20px' }} />
                    </div>
                    <div className={styles.serviceTitle}>General Contracting</div>
                    <div className={styles.serviceDesc}>
                      Full-scale management of construction projects from
                      start to finish.
                    </div>
                  </div>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceIcon}>
                      <iconify-icon icon="lucide:plug-zap" style={{ fontSize: '20px' }} />
                    </div>
                    <div className={styles.serviceTitle}>Electrical Installs</div>
                    <div className={styles.serviceDesc}>
                      Commercial and residential wiring, panel upgrades, and
                      lighting.
                    </div>
                  </div>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceIcon}>
                      <iconify-icon icon="lucide:droplets" style={{ fontSize: '20px' }} />
                    </div>
                    <div className={styles.serviceTitle}>Plumbing Systems</div>
                    <div className={styles.serviceDesc}>
                      Pipe fitting, water heating systems, and complete
                      bathroom overhauls.
                    </div>
                  </div>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceIcon}>
                      <iconify-icon icon="lucide:paint-roller" style={{ fontSize: '20px' }} />
                    </div>
                    <div className={styles.serviceTitle}>
                      Renovation & Painting
                    </div>
                    <div className={styles.serviceDesc}>
                      Interior and exterior renovations to breathe new life
                      into spaces.
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications Section */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    Certifications & Awards
                  </h2>
                  <div className={styles.sectionAction}>
                    <iconify-icon icon="lucide:plus" style={{ fontSize: '16px' }} />
                    Add Certification
                  </div>
                </div>
                <div className={styles.certGrid}>
                  <div className={styles.certCard}>
                    <div className={styles.certIcon}>
                      <iconify-icon icon="lucide:award" style={{ fontSize: '24px' }} />
                    </div>
                    <div className={styles.certInfo}>
                      <h4>ISO 9001 Certified</h4>
                      <span>Quality Management</span>
                    </div>
                  </div>
                  <div className={styles.certCard}>
                    <div className={styles.certIcon}>
                      <iconify-icon icon="lucide:shield-check" style={{ fontSize: '24px' }} />
                    </div>
                    <div className={styles.certInfo}>
                      <h4>OSHA Safety Excellence</h4>
                      <span>2023 National Award</span>
                    </div>
                  </div>
                  <div className={styles.certCard}>
                    <div className={styles.certIcon}>
                      <iconify-icon icon="lucide:leaf" style={{ fontSize: '24px' }} />
                    </div>
                    <div className={styles.certInfo}>
                      <h4>Green Builder Council</h4>
                      <span>Eco-friendly practices</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Completed Projects</h2>
                  <div className={styles.sectionAction}>
                    <iconify-icon icon="lucide:plus" style={{ fontSize: '16px' }} />
                    Add Project
                  </div>
                </div>
                <div className={styles.portfolioGrid}>
                  <div className={styles.portfolioItem}>
                    <div className={styles.portfolioImg}>
                      <img
                        alt="Commercial Office Complex"
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/bbd01a2b-cf15-4d1d-9f3d-3014a644daf0.jpg"
                      />
                    </div>
                    <div className={styles.portfolioInfo}>
                      <div className={styles.portfolioTitle}>
                        Tech Hub Headquarters
                      </div>
                      <div className={styles.portfolioCat}>
                        <iconify-icon icon="lucide:building" style={{ fontSize: '14px' }} />
                        Commercial Construction
                      </div>
                      <div className={styles.portfolioMeta}>
                        <span>Completed Oct 2023</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>$1.2M</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.portfolioItem}>
                    <div className={styles.portfolioImg}>
                      <img
                        alt="Luxury Kitchen Renovation"
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/2048c2ed-25a3-4789-b084-e2268e32279a.jpg"
                      />
                    </div>
                    <div className={styles.portfolioInfo}>
                      <div className={styles.portfolioTitle}>
                        Luxury Kitchen Overhaul
                      </div>
                      <div className={styles.portfolioCat}>
                        <iconify-icon icon="lucide:home" style={{ fontSize: '14px' }} />
                        Residential Renovation
                      </div>
                      <div className={styles.portfolioMeta}>
                        <span>Completed Aug 2023</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>$85k</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.portfolioItem}>
                    <div className={styles.portfolioImg}>
                      <img
                        alt="Warehouse Facility"
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/9915e35c-10b5-4c26-9814-115d6b75a904.jpg"
                      />
                    </div>
                    <div className={styles.portfolioInfo}>
                      <div className={styles.portfolioTitle}>
                        Logistics Warehouse Build
                      </div>
                      <div className={styles.portfolioCat}>
                        <iconify-icon icon="lucide:factory" style={{ fontSize: '14px' }} />
                        Industrial
                      </div>
                      <div className={styles.portfolioMeta}>
                        <span>Completed May 2023</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>$3.5M</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.portfolioItem}>
                    <div className={styles.portfolioImg}>
                      <img
                        alt="Bathroom Remodel"
                        src="https://storage.googleapis.com/banani-generated-images/generated-images/95689573-15ae-40a3-bfe9-37267c91c63d.jpg"
                      />
                    </div>
                    <div className={styles.portfolioInfo}>
                      <div className={styles.portfolioTitle}>
                        Boutique Hotel Bathrooms
                      </div>
                      <div className={styles.portfolioCat}>
                        <iconify-icon icon="lucide:bath" style={{ fontSize: '14px' }} />
                        Commercial Renovation
                      </div>
                      <div className={styles.portfolioMeta}>
                        <span>Completed Jan 2023</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>$250k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Client Reviews</h2>
                  <div className={styles.sectionAction}>
                    View All (124)
                  </div>
                </div>
                <div className={styles.reviewsList}>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewer}>
                        <div className={styles.reviewerAvatar}>
                          <img
                            src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F1"
                            alt="Client"
                          />
                        </div>
                        <div className={styles.reviewerInfo}>
                          <h4>Michael Roberts</h4>
                          <span>Commercial Office Renovation • 2 weeks ago</span>
                        </div>
                      </div>
                      <div className={styles.reviewStars}>
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                      </div>
                    </div>
                    <div className={styles.reviewText}>
                      Apex Construction delivered our office renovation
                      exactly on schedule. The project manager was
                      communicative, and the quality of work exceeded our
                      expectations. Highly recommend their team for large
                      commercial projects.
                    </div>
                  </div>

                  <div className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewer}>
                        <div className={styles.reviewerAvatar}>
                          <img
                            src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAsian%2F3"
                            alt="Client"
                          />
                        </div>
                        <div className={styles.reviewerInfo}>
                          <h4>Sarah Kim</h4>
                          <span>Residential Electrical Upgrade • 1 month ago</span>
                        </div>
                      </div>
                      <div className={styles.reviewStars}>
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                        <iconify-icon icon="lucide:star" style={{ fontVariationSettings: '"FILL" 1' }} />
                      </div>
                    </div>
                    <div className={styles.reviewText}>
                      Very professional and clean. They upgraded our entire
                      electrical panel and rewired the kitchen in just two
                      days. The technicians were polite and respectful of our
                      home.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar Details) */}
            <div className={styles.rightCol}>
              {/* Contact Info */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Contact Information</h2>
                  <div className={styles.sectionAction}>Edit</div>
                </div>
                <div className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}>
                      <iconify-icon icon="lucide:phone" style={{ fontSize: '18px' }} />
                    </div>
                    <div className={styles.infoText}>
                      <span>(555) 123-4567</span>
                      <span>Primary Phone</span>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}>
                      <iconify-icon icon="lucide:mail" style={{ fontSize: '18px' }} />
                    </div>
                    <div className={styles.infoText}>
                      <span>hello@apexconstruction.com</span>
                      <span>Email Address</span>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}>
                      <iconify-icon icon="lucide:globe" style={{ fontSize: '18px' }} />
                    </div>
                    <div className={styles.infoText}>
                      <span>www.apexconstruction.com</span>
                      <span>Company Website</span>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}>
                      <iconify-icon icon="lucide:map-pin" style={{ fontSize: '18px' }} />
                    </div>
                    <div className={styles.infoText}>
                      <span>123 Builder Lane, Suite 400<br />New York, NY 10001</span>
                      <span>Headquarters</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Business Hours</h2>
                  <div className={styles.sectionAction}>Edit</div>
                </div>
                <div className={styles.hoursList}>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Monday</span>
                    <span className={styles.hoursTime}>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className={styles.hoursRow}>
                    <span className={`${styles.hoursDay} ${styles.hoursToday}`}>Tuesday</span>
                    <span className={`${styles.hoursTime} ${styles.hoursToday}`}>8:00 AM - 6:00 PM (Open)</span>
                  </div>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Wednesday</span>
                    <span className={styles.hoursTime}>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Thursday</span>
                    <span className={styles.hoursTime}>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Friday</span>
                    <span className={styles.hoursTime}>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Saturday</span>
                    <span className={styles.hoursTime}>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Sunday</span>
                    <span className={`${styles.hoursTime} ${styles.hoursClosed}`}>Closed</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '24px' }}>
                  Company Stats
                </h2>
                <div className={styles.statsList}>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <iconify-icon icon="lucide:calendar-days" style={{ fontSize: '18px' }} />
                      Member Since
                    </div>
                    <div className={styles.statValue}>March 2021</div>
                  </div>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <iconify-icon icon="lucide:check-circle" style={{ fontSize: '18px' }} />
                      Jobs Completed
                    </div>
                    <div className={styles.statValue}>248</div>
                  </div>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <iconify-icon icon="lucide:users" style={{ fontSize: '18px' }} />
                      Team Size
                    </div>
                    <div className={styles.statValue}>15-50</div>
                  </div>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <iconify-icon icon="lucide:clock" style={{ fontSize: '18px' }} />
                      Response Time
                    </div>
                    <div className={styles.statValue}>~2 Hours</div>
                  </div>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <iconify-icon icon="lucide:languages" style={{ fontSize: '18px' }} />
                      Languages
                    </div>
                    <div className={styles.statValue}>English, Spanish</div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Team Members</h2>
                  <div className={styles.sectionAction}>Manage</div>
                </div>
                <div className={styles.teamList}>
                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar}>
                      <img
                        src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F3"
                        alt="Marcus"
                      />
                    </div>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamName}>Marcus Johnson</div>
                      <div className={styles.teamRole}>Lead Electrician</div>
                    </div>
                  </div>

                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar}>
                      <img
                        src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAfrican%2F1"
                        alt="Sarah"
                      />
                    </div>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamName}>Sarah Williams</div>
                      <div className={styles.teamRole}>Project Manager</div>
                    </div>
                  </div>

                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar}>
                      <img
                        src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FAsian%2F2"
                        alt="David"
                      />
                    </div>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamName}>David Chen</div>
                      <div className={styles.teamRole}>HVAC Technician</div>
                    </div>
                  </div>

                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar}>
                      <img
                        src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FHispanic%2F4"
                        alt="Carlos"
                      />
                    </div>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamName}>Carlos Mendez</div>
                      <div className={styles.teamRole}>Plumbing Specialist</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.btnOutline}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    View Entire Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
