const fs = require('fs');
let p = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/analytics/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace('import { useFetch } from "@/app/lib/useFetch";', 'import { useFetch } from "@/app/lib/useFetch";\nimport layoutStyles from "../page.module.css";');

c = c.replace('<main style={{ padding: 24 }}>', '<div className={layoutStyles.content}>\n    <main style={{ padding: 24 }}>');
c = c.replace(/<\/main>\s*\);/g, '</main>\n    </div>\n  );');

const debugSection = /<section style=\{\{ background: "#fff", borderRadius: 20, padding: 24 \}\}>\s*<h2 style=\{\{ marginTop: 0 \}\}>Company Snapshot<\/h2>\s*<pre style=\{\{ whiteSpace: "pre-wrap", margin: 0 \}\}>\{JSON\.stringify\(profile \|\| \{\}, null, 2\)\}<\/pre>\s*<\/section>/;

c = c.replace(debugSection, '');

fs.writeFileSync(p, c);
