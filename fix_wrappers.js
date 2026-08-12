const fs = require('fs');
const files = [
  'wallet/page.tsx',
  'team/page.tsx',
  'reviews/page.tsx',
  'analytics/page.tsx'
];
for(let f of files) {
  let p = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/' + f;
  let c = fs.readFileSync(p, 'utf8');
  if(!c.includes('import layoutStyles from')) {
    c = c.replace(/import styles from/g, 'import layoutStyles from "../page.module.css";\nimport styles from');
  }
  
  if (f === 'wallet/page.tsx') {
    c = c.replace('<div className={styles.container}', '<div className={layoutStyles.content}>\n      <div className={styles.container}');
    c = c.replace(/<\/div>\s*<\/>/g, '</div>\n      </div>\n    </>');
  } else if (f === 'team/page.tsx') {
    c = c.replace('<div className={styles.container}', '<div className={layoutStyles.content}>\n      <div className={styles.container}');
    c = c.replace(/<\/div>\s*<\/>/g, '</div>\n      </div>\n    </>');
  } else if (f === 'reviews/page.tsx') {
    c = c.replace('<div className={styles.container}', '<div className={layoutStyles.content}>\n      <div className={styles.container}');
    c = c.replace(/<\/div>\s*<\/>/g, '</div>\n      </div>\n    </>');
  } else if (f === 'analytics/page.tsx') {
    c = c.replace('<main style={{ padding: 24 }}>', '<div className={layoutStyles.content}>\n    <main style={{ padding: 24 }}>');
    c = c.replace(/<\/main>\s*\);/g, '</main>\n    </div>\n  );');
  }
  
  fs.writeFileSync(p, c);
}
