const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company';
const files = [
    'analytics/page.tsx',
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

    // 2. Remove layout wrapper and sidebar
    // Find 'return ('
    const returnStart = content.lastIndexOf('return (');
    if (returnStart !== -1) {
        // Find <aside
        const asideStart = content.indexOf('<aside', returnStart);
        if (asideStart !== -1) {
            const asideEnd = content.indexOf('</aside>', asideStart);
            if (asideEnd !== -1) {
                // Find DashboardHeader
                const headerStart = content.indexOf('<DashboardHeader', asideEnd);
                if (headerStart !== -1) {
                    const headerEnd = content.indexOf('/>', headerStart);
                    if (headerEnd !== -1) {
                        // Replace everything from 'return (' to headerEnd + 2
                        content = content.substring(0, returnStart) + 'return (\n    <>\n' + content.substring(headerEnd + 2);
                        changed = true;
                    }
                }
            }
        }
    }

    // 3. Remove closing divs (only if we did step 2!)
    if (changed) {
        // The file usually ends with:
        //       </main>
        //     </div>
        //   );
        // }
        // We just replace everything after the LAST </div> that we want to keep.
        // Actually, let's just find `</main>` and remove it and everything after up to `);`
        const mainEnd = content.lastIndexOf('</main>');
        if (mainEnd !== -1) {
            const parenEnd = content.lastIndexOf(');', mainEnd + 100);
            if (parenEnd !== -1) {
                content = content.substring(0, mainEnd) + '\n    </>\n  ' + content.substring(parenEnd);
            }
        }
    }

    if (changed) {
        fs.writeFileSync(p, content, 'utf8');
        console.log('Updated', rel);
    }
}
