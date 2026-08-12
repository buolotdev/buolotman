const fs = require('fs');
const path = require('path');

const correctNavItems = `  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard", match: (p: string) => p === "/dashboard/company" },
    { id: "profile", label: "Profile Management", href: "/dashboard/company/profile", icon: "lucide:user", match: (p: string) => p.startsWith("/dashboard/company/profile") },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers", match: (p: string) => p.startsWith("/dashboard/company/services") },
    { id: "projects", label: "Projects & Gallery", href: "/dashboard/company/projects", icon: "lucide:briefcase", match: (p: string) => p.startsWith("/dashboard/company/projects") },
    { id: "quotes", label: "Quote Requests", href: "/dashboard/company/quotes", icon: "lucide:file-text", match: (p: string) => p.startsWith("/dashboard/company/quotes") },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", match: (p: string) => p.startsWith("/dashboard/company/messages") },
    { id: "reviews", label: "Reviews", href: "/dashboard/company/reviews", icon: "lucide:star", match: (p: string) => p.startsWith("/dashboard/company/reviews") },
    { id: "analytics", label: "Analytics", href: "/dashboard/company/analytics", icon: "lucide:bar-chart-2", match: (p: string) => p.startsWith("/dashboard/company/analytics") },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings", match: (p: string) => p.startsWith("/dashboard/company/settings") },
    { id: "wallet", label: "Wallet (Legacy)", href: "/dashboard/company/wallet", icon: "lucide:wallet", match: (p: string) => p.startsWith("/dashboard/company/wallet") },
    { id: "team", label: "Team (Legacy)", href: "/dashboard/company/team", icon: "lucide:users", match: (p: string) => p.startsWith("/dashboard/company/team") },
  ];`;

const correctHeader = (stylesName) => `        <div className={${stylesName}.sidebarHeader}>
          <Link href="/" className={${stylesName}.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={${stylesName}.brandImage} priority />
            <div className={${stylesName}.brandText}>
              <span className={${stylesName}.brandEyebrow}>Boulot Man</span>
              <span className={${stylesName}.brandTitle}>Company Space</span>
            </div>
          </Link>
        </div>`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            processDir(p);
        } else if (f === 'page.tsx') {
            let content = fs.readFileSync(p, 'utf8');
            let changed = false;
            
            // Extract the style object name (e.g. styles or layoutStyles)
            const styleMatch = content.match(/className=\{([a-zA-Z0-9_]+)\.sidebarHeader\}/);
            const styleName = styleMatch ? styleMatch[1] : 'styles';

            // Replace navItems array (using a regex that matches from const navItems = [ ... ];)
            // But handle cases where activeNav is used instead of match:
            // Since some pages don't have usePathname imported, replacing `match: ` might cause errors.
            // Let's check if the file uses `activeNav`
            const usesActiveNav = content.includes('activeNav === item.id');
            const navRegex = /const navItems = \[\s*\{[\s\S]*?\];/m;
            if (navRegex.test(content)) {
                if (usesActiveNav) {
                    const activeNavItems = correctNavItems.replace(/, match: \([^)]+\) => [^\}]+/g, "");
                    content = content.replace(navRegex, activeNavItems);
                } else {
                    content = content.replace(navRegex, correctNavItems);
                }
                changed = true;
            }

            // Replace sidebarHeader
            // Match the old sidebar header up to </Link> </div>
            const headerRegex = /<div className=\{[a-zA-Z0-9_]+\.sidebarHeader\}>[\s\S]*?<\/Link>\s*<\/div>/m;
            if (headerRegex.test(content)) {
                content = content.replace(headerRegex, correctHeader(styleName));
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(p, content, 'utf8');
                console.log('Updated', p);
            }
        }
    }
}

processDir('c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company');
