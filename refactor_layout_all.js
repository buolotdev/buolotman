const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company';
const files = [
    'analytics/page.tsx',
    'quotes/page.tsx',
    'reviews/page.tsx',
    'services/page.tsx',
    'settings/page.tsx',
    'tasks/page.tsx',
    'team/page.tsx',
    'teams/page.tsx',
];

for (const rel of files) {
    const p = path.join(dir, rel);
    if (!fs.existsSync(p)) continue;

    let content = fs.readFileSync(p, 'utf8');
    let changed = false;

    // 1. Remove navItems array
    const navStart = content.indexOf('const navItems = [');
    if (navStart !== -1) {
        const navEnd = content.indexOf('];', navStart);
        if (navEnd !== -1) {
            content = content.substring(0, navStart) + content.substring(navEnd + 2);
            changed = true;
        }
    }

    // 2. Full Sidebar structure
    const returnStart = content.lastIndexOf('return (');
    if (returnStart !== -1) {
        const asideStart = content.indexOf('<aside', returnStart);
        if (asideStart !== -1) {
            const headerEnd = content.indexOf('/>', content.indexOf('<DashboardHeader', asideStart));
            if (headerEnd !== -1 && headerEnd > asideStart) {
                content = content.substring(0, returnStart) + 'return (\n    <>\n' + content.substring(headerEnd + 2);
                const mainEnd = content.lastIndexOf('</main>');
                if (mainEnd !== -1) {
                    const parenEnd = content.lastIndexOf(');', mainEnd + 100);
                    if (parenEnd !== -1) {
                        content = content.substring(0, mainEnd) + '\n    </>\n  ' + content.substring(parenEnd);
                    }
                }
                changed = true;
            }
        } else {
            // No sidebar, but might have <main> <DashboardHeader>
            const mainStart = content.indexOf('<main', returnStart);
            if (mainStart !== -1) {
                const mainEndBracket = content.indexOf('>', mainStart);
                const headerStart = content.indexOf('<DashboardHeader', mainEndBracket);
                if (headerStart !== -1 && headerStart - mainEndBracket < 100) {
                    const headerEnd = content.indexOf('/>', headerStart);
                    content = content.substring(0, returnStart) + 'return (\n    <>\n' + content.substring(headerEnd + 2);
                    const mainEnd = content.lastIndexOf('</main>');
                    if (mainEnd !== -1) {
                        const parenEnd = content.lastIndexOf(');', mainEnd + 100);
                        if (parenEnd !== -1) {
                            content = content.substring(0, mainEnd) + '\n    </>\n  ' + content.substring(parenEnd);
                        }
                    }
                    changed = true;
                } else if (mainStart !== -1) {
                    // No DashboardHeader, just <main>
                    content = content.substring(0, returnStart) + 'return (\n    <>\n' + content.substring(mainEndBracket + 1);
                    const mainEnd = content.lastIndexOf('</main>');
                    if (mainEnd !== -1) {
                        const parenEnd = content.lastIndexOf(');', mainEnd + 100);
                        if (parenEnd !== -1) {
                            content = content.substring(0, mainEnd) + '\n    </>\n  ' + content.substring(parenEnd);
                        }
                    }
                    changed = true;
                }
            }
        }
    }

    if (changed) {
        fs.writeFileSync(p, content, 'utf8');
        console.log('Updated', rel);
    }
}
