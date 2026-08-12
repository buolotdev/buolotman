const fs = require('fs');
let teamPath = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/team/page.tsx';
let content = fs.readFileSync(teamPath, 'utf8');

// 1. Clear mockTeam
content = content.replace(/const mockTeam = \[[\s\S]*?\];/, "const mockTeam: any[] = [];");

// 2. Empty State
const teamTableRegex = /\{team\.map\(\(member\) => \([\s\S]*?\}\)\}/;
const teamEmptyState = `
          {team.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
              <iconify-icon icon="lucide:users" style={{ fontSize: "48px", marginBottom: "16px", display: "block" }}></iconify-icon>
              <h3 style={{ margin: "0 0 8px" }}>No team members found</h3>
              <p style={{ margin: 0 }}>You haven't added any team members yet.</p>
            </div>
          ) : (
            team.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <div className={styles.memberInfo}>
                    <div className={styles.avatar}>{member.initials}</div>
                    <div className={styles.details}>
                      <h3 className={styles.name}>{member.name}</h3>
                      <span className={styles.role}>{member.role}</span>
                    </div>
                  </div>
                  <span className={\`\${styles.status} \${member.status === 'active' ? styles.statusActive : styles.statusPending}\`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </div>
                <div className={styles.memberContact}>
                  <div className={styles.contactItem}>
                    <iconify-icon icon="lucide:mail" /> {member.email}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>Edit Role</button>
                  <button className={\`\${styles.actionBtn} \${styles.actionBtnRemove}\`}>Remove</button>
                </div>
              </div>
            ))
          )}
`;
content = content.replace(teamTableRegex, teamEmptyState.trim());

// 3. Fix Layout Wrapper
// Remove the main wrapper and dashboard header entirely
const wrapperRegex = /return\s*\(\s*<main\s+className=[^>]*mainWrapper[^>]*>[\s\S]*?<DashboardHeader[\s\S]*?\/>/g;
if (wrapperRegex.test(content)) {
    content = content.replace(wrapperRegex, 'return (\n    <>\n      <div className={layoutStyles.content}>');
    const mainEndIdx = content.lastIndexOf('</main>');
    if (mainEndIdx !== -1) {
        content = content.substring(0, mainEndIdx) + '\n      </div>\n    </>' + content.substring(mainEndIdx + 7);
    }
}
// Add layoutStyles import if missing
if (!content.includes('import layoutStyles from')) {
    content = content.replace(/import styles from/g, 'import layoutStyles from "../page.module.css";\nimport styles from');
}

// Remove unnecessary navItems and mobileSidebar state if present
content = content.replace(/const navItems = \[\s*\{[\s\S]*?\];/g, "");
content = content.replace(/const \[mobileSidebarOpen[^;]+;/g, "");
content = content.replace(/import DashboardHeader[^;]+;/g, "");

fs.writeFileSync(teamPath, content, 'utf8');
