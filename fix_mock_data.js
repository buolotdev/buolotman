const fs = require('fs');

let teamPath = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/team/page.tsx';
let teamContent = fs.readFileSync(teamPath, 'utf8');
teamContent = teamContent.replace(/const mockTeam = \[[\s\S]*?\];/, "const mockTeam: any[] = [];");
// Handle empty state for team list
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
teamContent = teamContent.replace(teamTableRegex, teamEmptyState.trim());
fs.writeFileSync(teamPath, teamContent, 'utf8');


let reviewsPath = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/reviews/page.tsx';
let revContent = fs.readFileSync(reviewsPath, 'utf8');
revContent = revContent.replace(/const mockReviews = \[[\s\S]*?\];/, "const mockReviews: any[] = [];");
fs.writeFileSync(reviewsPath, revContent, 'utf8');
