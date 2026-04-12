"use client";
import React, { useEffect } from "react";

export default function Header() {
  useEffect(() => {
    // ===== MEGA MENU (top strip) =====
    const root = document.getElementById("bmMegaRoot");
    if (!root) return;

    const megaMap: Record<string, Element | null> = {
      cats: root.querySelector("#bmMegaCats"),
      apps: root.querySelector("#bmMegaApps"),
      help: root.querySelector("#bmMegaHelp"),
    };

    function closeAllMega() {
      Object.values(megaMap).forEach((m) => m?.classList.remove("active"));
    }

    root.querySelectorAll(".bmNavItem").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const key = (item as HTMLElement).dataset.menu || "";
        closeAllMega();
        megaMap[key]?.classList.add("active");
      });
    });

    root.addEventListener("mouseleave", closeAllMega);

    // Category sidebar hover
    root.querySelectorAll(".bmSideBtn").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        root.querySelectorAll(".bmSideBtn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = (btn as HTMLElement).dataset.cat;
        root.querySelectorAll(".bmGrid").forEach((g: Element) => {
          (g as HTMLElement).style.display = "none";
        });
        const panel = root.querySelector(`.bmGrid[data-panel="${cat}"]`) as HTMLElement | null;
        if (panel) panel.style.display = "grid";
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

    document.addEventListener("click", () => {
      root.querySelectorAll(".bmDropMenu").forEach((m) => {
        (m as HTMLElement).style.display = "none";
      });
    });

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
      root.removeEventListener("mouseleave", closeAllMega);
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
      <div class="bmNavItem" data-menu="cats">All Categories</div>
      <div class="bmNavItem" data-menu="apps">Apps</div>
      <div class="bmNavItem" data-menu="help">Help Center</div>
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

<!-- ================= CATEGORIES MEGA ================= -->
<div class="bmMega" id="bmMegaCats">
  <div class="bmMegaInner">
    <div class="bmSidebar">
      <button class="bmSideBtn active" data-cat="eng">Engineering &amp; Technology Services</button>
      <button class="bmSideBtn" data-cat="it">IT Infrastructure &amp; Networking</button>
      <button class="bmSideBtn" data-cat="cyber">Cybersecurity Services</button>
      <button class="bmSideBtn" data-cat="cloud">Cloud &amp; Systems Engineering</button>
      <button class="bmSideBtn" data-cat="electrical">Electrical &amp; Electronics Engineering</button>
      <button class="bmSideBtn" data-cat="mechanical">Mechanical, Civil &amp; Industrial</button>
      <button class="bmSideBtn" data-cat="renewable">Renewable Energy &amp; Utilities</button>
      <button class="bmSideBtn" data-cat="special">Specialized Technical Services</button>
      <button class="bmSideBtn" data-cat="telecom">Telecom &amp; Broadcast</button>
      <button class="bmSideBtn" data-cat="handyman">Handyman Services</button>
      <button class="bmSideBtn" data-cat="health">Health &amp; Beauty Technicians</button>
      <button class="bmSideBtn" data-cat="education">Education &amp; Learning</button>
    </div>
    <div class="bmContent">
      <div class="bmGrid" data-panel="eng">
        <div class="bmCard">
          <h4>Software &amp; Digital Engineering</h4>
          <a class="bmItem" href="#">Web application development</a>
          <a class="bmItem" href="#">Mobile application development (Android / iOS)</a>
          <a class="bmItem" href="#">Backend systems &amp; API development</a>
          <a class="bmItem" href="#">DevOps &amp; cloud deployment</a>
          <a class="bmItem" href="#">Database design &amp; optimization</a>
          <a class="bmItem" href="#">ERP &amp; CRM system implementation</a>
          <a class="bmItem" href="#">Software maintenance &amp; upgrades</a>
          <a class="bmItem" href="#">UI/UX design engineering</a>
          <a class="bmItem" href="#">QA testing &amp; automation</a>
          <a class="bmItem" href="#">Legacy system modernization</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="it" style="display:none">
        <div class="bmCard">
          <h4>IT Infrastructure &amp; Networking</h4>
          <a class="bmItem" href="#">Network design &amp; installation</a>
          <a class="bmItem" href="#">LAN/WAN configuration</a>
          <a class="bmItem" href="#">Server setup &amp; management</a>
          <a class="bmItem" href="#">Data center deployment</a>
          <a class="bmItem" href="#">Firewall &amp; routing configuration</a>
          <a class="bmItem" href="#">Wireless network optimization</a>
          <a class="bmItem" href="#">Network security audits</a>
          <a class="bmItem" href="#">IT infrastructure maintenance</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="cyber" style="display:none">
        <div class="bmCard">
          <h4>Cybersecurity Services</h4>
          <a class="bmItem" href="#">Security risk assessments</a>
          <a class="bmItem" href="#">Penetration testing</a>
          <a class="bmItem" href="#">System hardening</a>
          <a class="bmItem" href="#">SOC setup &amp; monitoring</a>
          <a class="bmItem" href="#">Data protection &amp; encryption</a>
          <a class="bmItem" href="#">Incident response &amp; recovery</a>
          <a class="bmItem" href="#">Compliance (ISO 27001, GDPR readiness)</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="cloud" style="display:none">
        <div class="bmCard">
          <h4>Cloud &amp; Systems Engineering</h4>
          <a class="bmItem" href="#">Cloud migration (AWS, Azure, GCP)</a>
          <a class="bmItem" href="#">Virtualization (VMware, Proxmox)</a>
          <a class="bmItem" href="#">Backup &amp; disaster recovery systems</a>
          <a class="bmItem" href="#">Cloud cost optimization</a>
          <a class="bmItem" href="#">Hybrid infrastructure design</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="electrical" style="display:none">
        <div class="bmCard">
          <h4>Electrical Engineering Services</h4>
          <a class="bmItem" href="#">Residential electrical installation</a>
          <a class="bmItem" href="#">Commercial electrical systems</a>
          <a class="bmItem" href="#">Industrial electrical wiring</a>
          <a class="bmItem" href="#">Solar PV system design &amp; installation</a>
          <a class="bmItem" href="#">Generator installation &amp; servicing</a>
          <a class="bmItem" href="#">Earthing &amp; surge protection</a>
        </div>
        <div class="bmCard">
          <h4>Electronics &amp; Embedded Systems</h4>
          <a class="bmItem" href="#">CCTV &amp; surveillance systems</a>
          <a class="bmItem" href="#">Access control &amp; biometric systems</a>
          <a class="bmItem" href="#">Fire alarm systems</a>
          <a class="bmItem" href="#">Smart home systems</a>
          <a class="bmItem" href="#">IoT device deployment</a>
          <a class="bmItem" href="#">Electronics repair &amp; diagnostics</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="mechanical" style="display:none">
        <div class="bmCard">
          <h4>Mechanical Engineering</h4>
          <a class="bmItem" href="#">HVAC installation &amp; servicing</a>
          <a class="bmItem" href="#">Industrial machinery maintenance</a>
          <a class="bmItem" href="#">Pumps &amp; motors installation</a>
          <a class="bmItem" href="#">Welding &amp; fabrication</a>
        </div>
        <div class="bmCard">
          <h4>Civil &amp; Construction Engineering</h4>
          <a class="bmItem" href="#">Structural design &amp; supervision</a>
          <a class="bmItem" href="#">Building construction management</a>
          <a class="bmItem" href="#">Renovation &amp; remodeling</a>
          <a class="bmItem" href="#">Road &amp; drainage works</a>
          <a class="bmItem" href="#">Quantity surveying</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="renewable" style="display:none">
        <div class="bmCard">
          <h4>Renewable Energy &amp; Utilities</h4>
          <a class="bmItem" href="#">Solar &amp; wind system installation</a>
          <a class="bmItem" href="#">Energy audits</a>
          <a class="bmItem" href="#">Water treatment systems</a>
          <a class="bmItem" href="#">Borehole drilling supervision</a>
          <a class="bmItem" href="#">Utility infrastructure maintenance</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="special" style="display:none">
        <div class="bmCard">
          <h4>Automotive &amp; Heavy Equipment</h4>
          <a class="bmItem" href="#">Vehicle diagnostics &amp; repair</a>
          <a class="bmItem" href="#">Fleet maintenance services</a>
          <a class="bmItem" href="#">Heavy machinery operation &amp; servicing</a>
          <a class="bmItem" href="#">Electrical auto systems</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="telecom" style="display:none">
        <div class="bmCard">
          <h4>Telecom &amp; Broadcast</h4>
          <a class="bmItem" href="#">Fiber optic installation</a>
          <a class="bmItem" href="#">Tower installation &amp; maintenance</a>
          <a class="bmItem" href="#">VSAT systems</a>
          <a class="bmItem" href="#">Radio &amp; broadcast equipment setup</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="handyman" style="display:none">
        <div class="bmCard">
          <h4>Home &amp; Building Maintenance</h4>
          <a class="bmItem" href="#">Minor home repairs</a>
          <a class="bmItem" href="#">Furniture fixing &amp; assembly</a>
          <a class="bmItem" href="#">Door &amp; window repairs</a>
          <a class="bmItem" href="#">Lock installation &amp; repair</a>
        </div>
        <div class="bmCard">
          <h4>Plumbing Services</h4>
          <a class="bmItem" href="#">Leak detection &amp; repair</a>
          <a class="bmItem" href="#">Pipe installation</a>
          <a class="bmItem" href="#">Toilet &amp; sink repairs</a>
          <a class="bmItem" href="#">Water heater installation</a>
          <a class="bmItem" href="#">Drain cleaning</a>
        </div>
        <div class="bmCard">
          <h4>Cleaning &amp; Domestic</h4>
          <a class="bmItem" href="#">House cleaning</a>
          <a class="bmItem" href="#">Office cleaning</a>
          <a class="bmItem" href="#">Post-construction cleaning</a>
          <a class="bmItem" href="#">Carpet &amp; upholstery cleaning</a>
        </div>
        <div class="bmCard">
          <h4>Painting &amp; Decoration</h4>
          <a class="bmItem" href="#">Interior painting</a>
          <a class="bmItem" href="#">Exterior painting</a>
          <a class="bmItem" href="#">Wallpaper installation</a>
          <a class="bmItem" href="#">Surface preparation</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="health" style="display:none">
        <div class="bmCard">
          <h4>Health &amp; Beauty</h4>
          <a class="bmItem" href="#">Hair Dresser</a>
          <a class="bmItem" href="#">Barber</a>
          <a class="bmItem" href="#">Nail Technician (Manicure &amp; Pedicure)</a>
          <a class="bmItem" href="#">Make-up artist</a>
          <a class="bmItem" href="#">Private Nurse</a>
        </div>
      </div>
      <div class="bmGrid" data-panel="education" style="display:none">
        <div class="bmCard">
          <h4>Education &amp; Learning</h4>
          <a class="bmItem" href="#">Home tutor</a>
          <a class="bmItem" href="#">Translator</a>
          <a class="bmItem" href="#">Script writer</a>
          <a class="bmItem" href="#">Document compiler</a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ================= APPS MEGA ================= -->
<div class="bmMega" id="bmMegaApps">
  <div class="bmSimple">
    <div class="bmSimpleCard">
      <h4>Get the Boulot Man App on Play Store</h4>
      <img class="bmStoreBadge" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg">
    </div>
    <div class="bmSimpleCard">
      <h4>Get the Boulot Man App on App Store</h4>
      <img class="bmStoreBadge" src="https://upload.wikimedia.org/wikipedia/commons/9/96/Download_on_the_App_Store_Badge.svg">
    </div>
    <div class="bmSimpleCard">
      <h4>Follow Us on Social Media</h4>
      <div class="bmSocial"><span>Facebook</span><span>Twitter</span><span>Instagram</span><span>LinkedIn</span></div>
    </div>
  </div>
</div>

<!-- ================= HELP MEGA ================= -->
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

<!-- ================= MOBILE MENU ================= -->
<div class="bmMobileMenu" id="bmMobileMenu">
  <div class="bmMobileTop">All Categories</div>
  <div class="bmMobileSection">
    <div class="bmMobileCat">Software &amp; Digital Engineering</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="#">Web application development</a>
      <a class="bmMobileLink" href="#">Mobile application development (Android / iOS)</a>
      <a class="bmMobileLink" href="#">Backend systems &amp; API development</a>
      <a class="bmMobileLink" href="#">DevOps &amp; cloud deployment</a>
    </div>
    <div class="bmMobileCat">Handyman Services</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="#">Minor home repairs</a>
      <a class="bmMobileLink" href="#">Plumbing services</a>
      <a class="bmMobileLink" href="#">Electrical (Low Risk)</a>
      <a class="bmMobileLink" href="#">Painting &amp; Decoration</a>
      <a class="bmMobileLink" href="#">Cleaning &amp; Domestic</a>
    </div>
    <div class="bmMobileCat">Health &amp; Beauty Technicians</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="#">Hair Dresser</a>
      <a class="bmMobileLink" href="#">Barber</a>
      <a class="bmMobileLink" href="#">Nail Technician</a>
      <a class="bmMobileLink" href="#">Make-up artist</a>
    </div>
    <div class="bmMobileCat">Education &amp; Learning</div>
    <div class="bmMobileSub">
      <a class="bmMobileLink" href="#">Home tutor</a>
      <a class="bmMobileLink" href="#">Translator</a>
      <a class="bmMobileLink" href="#">Script writer</a>
    </div>
  </div>
  <div class="bmMobileTop">Apps</div>
  <div class="bmMobileSection">
    <a class="bmMobileLink" href="#">Get the Boulot Man App on Play Store</a>
    <a class="bmMobileLink" href="#">Get the Boulot Man App on App Store</a>
    <a class="bmMobileLink" href="#">Follow Us on Social Media</a>
  </div>
  <div class="bmMobileTop">Help Center</div>
  <div class="bmMobileSection">
    <a class="bmMobileLink" href="#">Help Center</a>
    <a class="bmMobileLink" href="#">Live Chat</a>
    <a class="bmMobileLink" href="#">More Support</a>
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
      <a href="#">Find Tasks</a>
      <a href="#">Technicians</a>
      <a href="#">Companies</a>
      <a href="#">How It Works</a>
      <a href="#" class="bm-main-btn bm-main-btn-outline">Login</a>
      <a href="#" class="bm-main-btn bm-main-btn-outline">Sign Up</a>
      <a href="#" class="bm-main-btn bm-main-btn-primary">Post a Task</a>
    </nav>
    <div class="bm-main-hamburger" id="bmMainHamburger">
      <div class="bm-main-hamburger-bars">
        <span></span><span></span><span></span>
      </div>
      <span class="bm-main-hamburger-label">Menu</span>
    </div>
  </div>
  <div class="bm-main-mobile-menu" id="bmMainMobileMenu">
    <a href="#">Find Tasks</a>
    <a href="#">Technicians</a>
    <a href="#">Companies</a>
    <a href="#">Login</a>
    <a href="#">Sign Up</a>
    <a href="#">Post a Task</a>
  </div>
</header>
`,
        }}
      />
    </>
  );
}
