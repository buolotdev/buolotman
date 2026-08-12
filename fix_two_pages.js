const fs = require('fs');

let mPath = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/messages/page.tsx';
let mContent = fs.readFileSync(mPath, 'utf8');
mContent = mContent.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\s*$/, "</>\n  );\n}\n");
fs.writeFileSync(mPath, mContent);

let pPath = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/projects/page.tsx';
let pContent = fs.readFileSync(pPath, 'utf8');
pContent = pContent.replace(/<div className={layoutStyles\.mainWrapper}>\s*<DashboardHeader[^>]*\/>/g, "");
pContent = pContent.replace(/<\/div>\s*<\/main>\s*<\/div>\s*<\/div>\s*\);\s*}\s*$/, "</main>\n    </>\n  );\n}\n");
fs.writeFileSync(pPath, pContent);
