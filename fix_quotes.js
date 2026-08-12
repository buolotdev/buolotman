const fs = require('fs');
let p = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/quotes/page.tsx';
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/<\/div>\s*<\/section>\s*<\/div>[\s\S]*$/, "            </div>\n          </section>\n        </div>\n    </>\n  );\n}\n");
fs.writeFileSync(p, content);
