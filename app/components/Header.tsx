"use client";
import React, { useEffect } from "react";
import "./header.css";

export default function Header() {
  useEffect(() => {
    // ===== MEGA MENU (top strip) =====
    const root = document.getElementById("bmMegaRoot");
    if (!root) return;

    // Category sidebar hover
    root.querySelectorAll(".bmSideBtn").forEach((btn) => {
      const activateSidebar = () => {
        root.querySelectorAll(".bmSideBtn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = (btn as HTMLElement).dataset.cat;
        root.querySelectorAll(".bmGrid").forEach((g: Element) => {
          (g as HTMLElement).style.display = "none";
        });
        const panel = root.querySelector(`.bmGrid[data-panel="${cat}"]`) as HTMLElement | null;
        if (panel) panel.style.display = "grid";
      };

      btn.addEventListener("mouseenter", activateSidebar);
      btn.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        activateSidebar();
      });
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        activateSidebar();
      });

      btn.addEventListener("keydown", (event) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
          keyEvent.preventDefault();
          activateSidebar();
        }
      });
    });

    // Country/Language dropdowns
    root.querySelectorAll(".bmDropBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = btn.nextElementSibling as HTMLElement | null;
        root.querySelectorAll(".bmDropMenu").forEach((m) => {
          if (m !== menu) (m as HTMLElement).style.display = "none";
        });
        if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
      });
    });

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || !root.contains(target)) {
        root.querySelectorAll(".bmDropMenu").forEach((m) => {
          (m as HTMLElement).style.display = "none";
        });
      }
    };

    const handleDocumentKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        root.querySelectorAll(".bmDropMenu").forEach((m) => {
          (m as HTMLElement).style.display = "none";
        });
      }
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleDocumentKeydown);

    // Mobile hamburger (mega menu strip)
    const burger = root.querySelector("#bmHamburger");
    const mobileMenu = root.querySelector("#bmMobileMenu");
    if (burger && mobileMenu) {
      burger.addEventListener("click", () => mobileMenu.classList.toggle("active"));
    }

    // Mobile accordion sections
    root.querySelectorAll(".bmMobileTop").forEach((top) => {
      top.addEventListener("click", () => {
        const section = top.nextElementSibling;
        root.querySelectorAll(".bmMobileSection").forEach((sec) => {
          if (sec !== section) sec.classList.remove("active");
        });
        section?.classList.toggle("active");
      });
    });

    root.querySelectorAll(".bmMobileCat").forEach((cat) => {
      cat.addEventListener("click", () => {
        const sub = cat.nextElementSibling;
        root.querySelectorAll(".bmMobileSub").forEach((s) => {
          if (s !== sub) s.classList.remove("active");
        });
        sub?.classList.toggle("active");
      });
    });

    // ===== MAIN HEADER hamburger =====
    const mainHamburger = document.querySelector(".bm-main-hamburger");
    const mainMobileMenu = document.getElementById("bmMainMobileMenu");
    if (mainHamburger && mainMobileMenu) {
      mainHamburger.addEventListener("click", () => {
        mainMobileMenu.classList.toggle("open");
      });
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleDocumentKeydown);
    };
  }, []);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `
<div id="bmMegaRoot">

<!--TOP HEADER HTML BEGINS-->

<!-- ================= HEADER ================= -->
<div class="bmHdr">
  <div class="bmHdrInner">

    <div class="bmNavLeft">
      <div class="bmMegaGroup" data-menu-group="cats">
        <div class="bmNavItem" data-menu="cats" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">All Categories</div>
        <div class="bmMega" id="bmMegaCats">
          <div class="bmMegaInner">
            <div class="bmSidebar">
              <button type="button" class="bmSideBtn active" data-cat="eng">Engineering &amp; Technology Services</button>
              <button type="button" class="bmSideBtn" data-cat="it">IT Infrastructure &amp; Networking</button>
              <button type="button" class="bmSideBtn" data-cat="cyber">Cybersecurity Services</button>
              <button type="button" class="bmSideBtn" data-cat="cloud">Cloud &amp; Systems Engineering</button>
              <button type="button" class="bmSideBtn" data-cat="electrical">Electrical &amp; Electronics Engineering</button>
              <button type="button" class="bmSideBtn" data-cat="mechanical">Mechanical, Civil &amp; Industrial</button>
              <button type="button" class="bmSideBtn" data-cat="renewable">Renewable Energy &amp; Utilities</button>
              <button type="button" class="bmSideBtn" data-cat="special">Specialized Technical Services</button>
              <button type="button" class="bmSideBtn" data-cat="telecom">Telecom &amp; Broadcast</button>
              <button type="button" class="bmSideBtn" data-cat="handyman">Handyman Services</button>
              <button type="button" class="bmSideBtn" data-cat="health">Health &amp; Beauty Technicians</button>
              <button type="button" class="bmSideBtn" data-cat="education">Education &amp; Learning</button>
            </div>
            <div class="bmContent">
              <div class="bmGrid" data-panel="eng">
                <div class="bmCard">
                  <h4>Software &amp; Digital Engineering</h4>
                  <a class="bmItem" href="/search?category=software">Web application development</a>
                  <a class="bmItem" href="/search?category=software">Mobile application development (Android / iOS)</a>
                  <a class="bmItem" href="/search?category=software">Backend systems &amp; API development</a>
                  <a class="bmItem" href="/search?category=software">DevOps &amp; cloud deployment</a>
                  <a class="bmItem" href="/search?category=software">Database design &amp; optimization</a>
                  <a class="bmItem" href="/search?category=software">ERP &amp; CRM system implementation</a>
                  <a class="bmItem" href="/search?category=software">Software maintenance &amp; upgrades</a>
                  <a class="bmItem" href="/search?category=software">UI/UX design engineering</a>
                  <a class="bmItem" href="/search?category=software">QA testing &amp; automation</a>
                  <a class="bmItem" href="/search?category=software">Legacy system modernization</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="it" style="display:none">
                <div class="bmCard">
                  <h4>IT Infrastructure &amp; Networking</h4>
                  <a class="bmItem" href="/search?category=networking">Network design &amp; installation</a>
                  <a class="bmItem" href="/search?category=networking">LAN/WAN configuration</a>
                  <a class="bmItem" href="/search?category=networking">Server setup &amp; management</a>
                  <a class="bmItem" href="/search?category=networking">Data center deployment</a>
                  <a class="bmItem" href="/search?category=networking">Firewall &amp; routing configuration</a>
                  <a class="bmItem" href="/search?category=networking">Wireless network optimization</a>
                  <a class="bmItem" href="/search?category=networking">Network security audits</a>
                  <a class="bmItem" href="/search?category=networking">IT infrastructure maintenance</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="cyber" style="display:none">
                <div class="bmCard">
                  <h4>Cybersecurity Services</h4>
                  <a class="bmItem" href="/search?category=security">Security risk assessments</a>
                  <a class="bmItem" href="/search?category=security">Penetration testing</a>
                  <a class="bmItem" href="/search?category=security">System hardening</a>
                  <a class="bmItem" href="/search?category=security">SOC setup &amp; monitoring</a>
                  <a class="bmItem" href="/search?category=security">Data protection &amp; encryption</a>
                  <a class="bmItem" href="/search?category=security">Incident response &amp; recovery</a>
                  <a class="bmItem" href="/search?category=security">Compliance (ISO 27001, GDPR readiness)</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="cloud" style="display:none">
                <div class="bmCard">
                  <h4>Cloud &amp; Systems Engineering</h4>
                  <a class="bmItem" href="/search?category=cloud">Cloud migration (AWS, Azure, GCP)</a>
                  <a class="bmItem" href="/search?category=cloud">Virtualization (VMware, Proxmox)</a>
                  <a class="bmItem" href="/search?category=cloud">Backup &amp; disaster recovery systems</a>
                  <a class="bmItem" href="/search?category=cloud">Cloud cost optimization</a>
                  <a class="bmItem" href="/search?category=cloud">Hybrid infrastructure design</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="electrical" style="display:none">
                <div class="bmCard">
                  <h4>Electrical Engineering Services</h4>
                  <a class="bmItem" href="/search?category=electrical">Residential electrical installation</a>
                  <a class="bmItem" href="/search?category=electrical">Commercial electrical systems</a>
                  <a class="bmItem" href="/search?category=electrical">Industrial electrical wiring</a>
                  <a class="bmItem" href="/search?category=electrical">Solar PV system design &amp; installation</a>
                  <a class="bmItem" href="/search?category=electrical">Generator installation &amp; servicing</a>
                  <a class="bmItem" href="/search?category=electrical">Earthing &amp; surge protection</a>
                </div>
                <div class="bmCard">
                  <h4>Electronics &amp; Embedded Systems</h4>
                  <a class="bmItem" href="/search?category=electronics">CCTV &amp; surveillance systems</a>
                  <a class="bmItem" href="/search?category=electronics">Access control &amp; biometric systems</a>
                  <a class="bmItem" href="/search?category=electronics">Fire alarm systems</a>
                  <a class="bmItem" href="/search?category=electronics">Smart home systems</a>
                  <a class="bmItem" href="/search?category=electronics">IoT device deployment</a>
                  <a class="bmItem" href="/search?category=electronics">Electronics repair &amp; diagnostics</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="mechanical" style="display:none">
                <div class="bmCard">
                  <h4>Mechanical Engineering</h4>
                  <a class="bmItem" href="/search?category=mechanical">HVAC installation &amp; servicing</a>
                  <a class="bmItem" href="/search?category=mechanical">Industrial machinery maintenance</a>
                  <a class="bmItem" href="/search?category=mechanical">Pumps &amp; motors installation</a>
                  <a class="bmItem" href="/search?category=mechanical">Welding &amp; fabrication</a>
                </div>
                <div class="bmCard">
                  <h4>Civil &amp; Construction Engineering</h4>
                  <a class="bmItem" href="/search?category=construction">Structural design &amp; supervision</a>
                  <a class="bmItem" href="/search?category=construction">Building construction management</a>
                  <a class="bmItem" href="/search?category=construction">Renovation &amp; remodeling</a>
                  <a class="bmItem" href="/search?category=construction">Road &amp; drainage works</a>
                  <a class="bmItem" href="/search?category=construction">Quantity surveying</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="renewable" style="display:none">
                <div class="bmCard">
                  <h4>Renewable Energy &amp; Utilities</h4>
                  <a class="bmItem" href="/search?category=energy">Solar &amp; wind system installation</a>
                  <a class="bmItem" href="/search?category=energy">Energy audits</a>
                  <a class="bmItem" href="/search?category=energy">Water treatment systems</a>
                  <a class="bmItem" href="/search?category=energy">Borehole drilling supervision</a>
                  <a class="bmItem" href="/search?category=energy">Utility infrastructure maintenance</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="special" style="display:none">
                <div class="bmCard">
                  <h4>Automotive &amp; Heavy Equipment</h4>
                  <a class="bmItem" href="/search?category=automotive">Vehicle diagnostics &amp; repair</a>
                  <a class="bmItem" href="/search?category=automotive">Fleet maintenance services</a>
                  <a class="bmItem" href="/search?category=automotive">Heavy machinery operation &amp; servicing</a>
                  <a class="bmItem" href="/search?category=automotive">Electrical auto systems</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="telecom" style="display:none">
                <div class="bmCard">
                  <h4>Telecom &amp; Broadcast</h4>
                  <a class="bmItem" href="/search?category=telecom">Fiber optic installation</a>
                  <a class="bmItem" href="/search?category=telecom">Tower installation &amp; maintenance</a>
                  <a class="bmItem" href="/search?category=telecom">VSAT systems</a>
                  <a class="bmItem" href="/search?category=telecom">Radio &amp; broadcast equipment setup</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="handyman" style="display:none">
                <div class="bmCard">
                  <h4>Home &amp; Building Maintenance</h4>
                  <a class="bmItem" href="/search?category=handyman">Minor home repairs</a>
                  <a class="bmItem" href="/search?category=handyman">Furniture fixing &amp; assembly</a>
                  <a class="bmItem" href="/search?category=handyman">Door &amp; window repairs</a>
                  <a class="bmItem" href="/search?category=handyman">Lock installation &amp; repair</a>
                </div>
                <div class="bmCard">
                  <h4>Plumbing Services</h4>
                  <a class="bmItem" href="/search?category=plumbing">Leak detection &amp; repair</a>
                  <a class="bmItem" href="/search?category=plumbing">Pipe installation</a>
                  <a class="bmItem" href="/search?category=plumbing">Toilet &amp; sink repairs</a>
                  <a class="bmItem" href="/search?category=plumbing">Water heater installation</a>
                  <a class="bmItem" href="/search?category=plumbing">Drain cleaning</a>
                </div>
                <div class="bmCard">
                  <h4>Cleaning &amp; Domestic</h4>
                  <a class="bmItem" href="/search?category=cleaning">House cleaning</a>
                  <a class="bmItem" href="/search?category=cleaning">Office cleaning</a>
                  <a class="bmItem" href="/search?category=cleaning">Post-construction cleaning</a>
                  <a class="bmItem" href="/search?category=cleaning">Carpet &amp; upholstery cleaning</a>
                </div>
                <div class="bmCard">
                  <h4>Painting &amp; Decoration</h4>
                  <a class="bmItem" href="/search?category=painting">Interior painting</a>
                  <a class="bmItem" href="/search?category=painting">Exterior painting</a>
                  <a class="bmItem" href="/search?category=painting">Wallpaper installation</a>
                  <a class="bmItem" href="/search?category=painting">Surface preparation</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="health" style="display:none">
                <div class="bmCard">
                  <h4>Health &amp; Beauty</h4>
                  <a class="bmItem" href="/search?category=beauty">Hair Dresser</a>
                  <a class="bmItem" href="/search?category=beauty">Barber</a>
                  <a class="bmItem" href="/search?category=beauty">Nail Technician (Manicure &amp; Pedicure)</a>
                  <a class="bmItem" href="/search?category=beauty">Make-up artist</a>
                  <a class="bmItem" href="/search?category=health">Private Nurse</a>
                </div>
              </div>
              <div class="bmGrid" data-panel="education" style="display:none">
                <div class="bmCard">
                  <h4>Education &amp; Learning</h4>
                  <a class="bmItem" href="/search?category=creative">Home tutor</a>
                  <a class="bmItem" href="/search?category=creative">Translator</a>
                  <a class="bmItem" href="/search?category=creative">Script writer</a>
                  <a class="bmItem" href="/search?category=creative">Document compiler</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bmMegaGroup" data-menu-group="apps">
        <div class="bmNavItem" data-menu="apps" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">Apps</div>
        <div class="bmMega" id="bmMegaApps">
          <div class="bmSimple">
            <div class="bmSimpleCard">
              <h4>Get the Boulot Man App on Play Store</h4>
              <a class="bmStoreButton" href="/search">Google Play</a>
            </div>
            <div class="bmSimpleCard">
              <h4>Get the Boulot Man App on App Store</h4>
              <a class="bmStoreButton" href="/search">App Store</a>
            </div>
            <div class="bmSimpleCard">
              <h4>Follow Us on Social Media</h4>
              <div class="bmSocial">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                <a href="https://x.com" target="_blank" rel="noreferrer">Twitter</a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bmMegaGroup" data-menu-group="help">
        <div class="bmNavItem" data-menu="help" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">Help Center</div>
        <div class="bmMega" id="bmMegaHelp">
          <div class="bmSimple">
            <div class="bmSimpleCard">
              <h4>Help Center</h4>
              <p>Browse guides, FAQs, and platform documentation.</p>
            </div>
            <div class="bmSimpleCard">
              <h4>Live Chat</h4>
              <p>Chat directly with Boulot Man support team.</p>
            </div>
            <div class="bmSimpleCard">
              <h4>More Support</h4>
              <p>Tickets, feedback, and account assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bmHamburger" id="bmHamburger">
      <span></span><span></span><span></span>
    </div>

    <div class="bmNavRight">
      <!-- COUNTRY -->
      <div class="bmDropWrap">
        <div class="bmDropBtn">
          <img class="bmFlag" src="https://flagcdn.com/w20/rw.png"> Rwanda
        </div>
        <div class="bmDropMenu">
          <div class="bmDropItem"><img class="bmFlag" src="https://flagcdn.com/w20/ke.png"> Kenya</div>
          <div class="bmDropItem"><img class="bmFlag" src="https://flagcdn.com/w20/ng.png"> Nigeria</div>
          <div class="bmDropItem"><img class="bmFlag" src="https://flagcdn.com/w20/ca.png"> Canada</div>
        </div>
      </div>
      <!-- LANGUAGE -->
      <div class="bmDropWrap">
        <div class="bmDropBtn">
          <img class="bmFlag" src="https://flagcdn.com/w20/gb.png"> English
        </div>
        <div class="bmDropMenu">
          <div class="bmDropItem"><img class="bmFlag" src="https://flagcdn.com/w20/gb.png"> English</div>
          <div class="bmDropItem"><img class="bmFlag" src="https://flagcdn.com/w20/fr.png"> Français</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ================= MOBILE MENU ================= -->
<div class="bmMobileMenu" id="bmMobileMenu">
  <div class="bmMobileTop">All Categories</div>
  <div class="bmMobileSection">
    <div class="bmMobileCat">Software &amp; Digital Engineering</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="/search?category=software">Web application development</a>
      <a class="bmMobileLink" href="/search?category=software">Mobile application development (Android / iOS)</a>
      <a class="bmMobileLink" href="/search?category=software">Backend systems &amp; API development</a>
      <a class="bmMobileLink" href="/search?category=software">DevOps &amp; cloud deployment</a>
    </div>
    <div class="bmMobileCat">Handyman Services</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="/search?category=handyman">Minor home repairs</a>
      <a class="bmMobileLink" href="/search?category=plumbing">Plumbing services</a>
      <a class="bmMobileLink" href="/search?category=electrical">Electrical (Low Risk)</a>
      <a class="bmMobileLink" href="/search?category=painting">Painting &amp; Decoration</a>
      <a class="bmMobileLink" href="/search?category=cleaning">Cleaning &amp; Domestic</a>
    </div>
    <div class="bmMobileCat">Health &amp; Beauty Technicians</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="/search?category=beauty">Hair Dresser</a>
      <a class="bmMobileLink" href="/search?category=beauty">Barber</a>
      <a class="bmMobileLink" href="/search?category=beauty">Nail Technician</a>
      <a class="bmMobileLink" href="/search?category=beauty">Make-up artist</a>
    </div>
    <div class="bmMobileCat">Education &amp; Learning</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="/search?category=creative">Home tutor</a>
      <a class="bmMobileLink" href="/search?category=creative">Translator</a>
      <a class="bmMobileLink" href="/search?category=creative">Script writer</a>
    </div>
  </div>
  <div class="bmMobileTop">Apps</div>
  <div class="bmMobileSection">
    <a class="bmMobileLink" href="/search">Get the Boulot Man App on Play Store</a>
    <a class="bmMobileLink" href="/search">Get the Boulot Man App on App Store</a>
    <a class="bmMobileLink" href="/search">Follow Us on Social Media</a>
  </div>
  <div class="bmMobileTop">Help Center</div>
  <div class="bmMobileSection">
    <a class="bmMobileLink" href="/help-center">Help Center</a>
    <a class="bmMobileLink" href="/help-center">Live Chat</a>
    <a class="bmMobileLink" href="/help-center">More Support</a>
  </div>
</div>

</div>
<!-- ================= END BOULOT MAN TOP HEADER MEGA MENU ================= -->

<!-- MAIN HEADER -->
<header class="bm-main-header">
  <div class="bm-main-header-inner">
    <div class="bm-main-logo">
      <img src="/boulotman-logo.png" alt="Boulot Man">
    </div>
    <nav class="bm-main-nav">
      <a href="/search">Find Tasks</a>
      <a href="/search?type=technician">Technicians</a>
      <a href="/search?type=company">Companies</a>
      <a href="/#how-it-works">How It Works</a>
      <a href="/login" class="bm-main-btn bm-main-btn-outline">Login</a>
      <a href="/signup" class="bm-main-btn bm-main-btn-outline">Sign Up</a>
      <a href="/post-task" class="bm-main-btn bm-main-btn-primary">Post a Task</a>
    </nav>
    <div class="bm-main-hamburger" id="bmMainHamburger">
      <div class="bm-main-hamburger-bars">
        <span></span><span></span><span></span>
      </div>
      <span class="bm-main-hamburger-label">Menu</span>
    </div>
  </div>
  <div class="bm-main-mobile-menu" id="bmMainMobileMenu">
    <a href="/search">Find Tasks</a>
    <a href="/search?type=technician">Technicians</a>
    <a href="/search?type=company">Companies</a>
    <a href="/login">Login</a>
    <a href="/signup">Sign Up</a>
    <a href="/post-task">Post a Task</a>
  </div>
</header>
`,
        }}
      />
    </>
  );
}

