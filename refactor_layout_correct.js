const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company';
const files = [
    'page.tsx',
    'analytics/page.tsx',
    'messages/page.tsx',
    'profile/page.tsx',
    'projects/page.tsx',
    'projects/tracking/page.tsx',
    'quotes/page.tsx',
    'reviews/page.tsx',
    'services/page.tsx',
    'settings/page.tsx',
    'tasks/page.tsx',
    'team/page.tsx',
    'teams/page.tsx',
    'wallet/page.tsx',
];

for (const rel of files) {
    const p = path.join(dir, rel);
    if (!fs.existsSync(p)) continue;

    let content = fs.readFileSync(p, 'utf8');
    let original = content;
    
    // We use a regex that matches from return ( <div class...layoutWrapper up to <DashboardHeader />
    const wrapperRegex = /return\s*\(\s*<div\s+className=[^>]*layoutWrapper[^>]*>[\s\S]*?<DashboardHeader[\s\S]*?\/>/g;
    
    if (wrapperRegex.test(content)) {
        content = content.replace(wrapperRegex, 'return (\n    <>');
        
        const mainEndIdx = content.lastIndexOf('</main>');
        if (mainEndIdx !== -1) {
            const parenEndIdx = content.lastIndexOf(');', mainEndIdx + 200);
            if (parenEndIdx !== -1) {
                content = content.substring(0, mainEndIdx) + '\n    </>\n  ' + content.substring(parenEndIdx);
            }
        }
    } else {
        const mainWrapperRegex = /return\s*\(\s*<main\s+className=[^>]*mainWrapper[^>]*>[\s\S]*?<DashboardHeader[\s\S]*?\/>/g;
        if (mainWrapperRegex.test(content)) {
            content = content.replace(mainWrapperRegex, 'return (\n    <>');
            
            const mainEndIdx = content.lastIndexOf('</main>');
            if (mainEndIdx !== -1) {
                const parenEndIdx = content.lastIndexOf(');', mainEndIdx + 200);
                if (parenEndIdx !== -1) {
                    content = content.substring(0, mainEndIdx) + '\n    </>\n  ' + content.substring(parenEndIdx);
                }
            }
        }
    }
    
    // Also remove navItems if present
    content = content.replace(/const navItems = \[\s*\{[\s\S]*?\];/g, "");
    content = content.replace(/const \[mobileSidebarOpen[^;]+;/g, "");
    content = content.replace(/import DashboardHeader[^;]+;/g, "");

    if (content !== original) {
        fs.writeFileSync(p, content, 'utf8');
        console.log('Fixed', rel);
    }
}
