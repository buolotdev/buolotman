const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            processDir(p);
        } else if (f === 'page.tsx') {
            let content = fs.readFileSync(p, 'utf8');
            let changed = false;
            
            // Remove the navItems array block
            const navRegex = /const navItems = \[\s*\{[\s\S]*?\];/m;
            if (navRegex.test(content)) {
                content = content.replace(navRegex, "");
                changed = true;
            }

            // Remove the top part of the return statement (from return ( <div class=layoutWrapper> down to <DashboardHeader ... /> )
            const returnRegex = /return\s*\(\s*<div className=\{[^}]+\.layoutWrapper[^}]+\}>[\s\S]*?<DashboardHeader[^>]*>\s*/m;
            if (returnRegex.test(content)) {
                content = content.replace(returnRegex, "return (\n    <>\n");
                changed = true;
            }

            // Remove the bottom part (</main> </div> )
            const bottomRegex = /<\/main>\s*<\/div>\s*\);\s*\}\s*$/m;
            if (bottomRegex.test(content)) {
                content = content.replace(bottomRegex, "    </>\n  );\n}\n");
                changed = true;
            }

            // Also, remove the activeNav / setMobileSidebarOpen state if present
            content = content.replace(/const \[mobileSidebarOpen[^;]+;/g, "");
            content = content.replace(/const \[activeNav[^;]+;/g, "");
            content = content.replace(/import DashboardHeader[^;]+;/g, "");
            content = content.replace(/import LogoutButton[^;]+;/g, "");

            if (changed) {
                fs.writeFileSync(p, content, 'utf8');
                console.log('Updated', p);
            }
        }
    }
}

processDir('c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company');
