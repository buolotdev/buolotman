const fs = require('fs');
let p = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/messages/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const wrapperRegex = /return\s*\(\s*<div\s+className=[^>]*layoutWrapper[^>]*>[\s\S]*?<DashboardHeader[\s\S]*?\/>/g;
if (wrapperRegex.test(c)) {
    c = c.replace(wrapperRegex, 'return (\n    <>');
}
c = c.replace(/const navItems = \[\s*\{[\s\S]*?\];/g, "");
c = c.replace(/const \[mobileSidebarOpen[^;]+;/g, "");
c = c.replace(/import DashboardHeader[^;]+;/g, "");

// Remove 2 extra divs at the bottom
c = c.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\s*$/, "    </div>\n    </>\n  );\n}\n");

fs.writeFileSync(p, c, 'utf8');
