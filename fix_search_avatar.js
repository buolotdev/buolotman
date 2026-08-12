const fs = require('fs');
let p = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/search/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const hookInsert = `
  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    if (token) {
      setIsAuth(true);
      setUserRole(role || "client");
      api.getMe().then(user => {
        const initials = \`\${(user.first_name || "")[0] || ""}\${(user.last_name || "")[0] || ""}\`.toUpperCase();
        setUserInitials(initials || user.username?.[0]?.toUpperCase() || "U");
      }).catch(() => {
        // Handle error silently
      });
    }
  }, []);

  const getDashboardLink = () => {
    const role = userRole.toLowerCase();
    if (role === "admin") return "/dashboard/admin";
    if (role === "company") return "/dashboard/company";
    if (role === "technician") return "/dashboard/technician";
    return "/dashboard/client";
  };
`;

if (!c.includes('const [isAuth, setIsAuth] = useState(false);')) {
  c = c.replace('export default function SearchPage() {', 'export default function SearchPage() {\n' + hookInsert);
}

const headerActionsTarget = `<div className={styles.headerActions}>
              <Link href="/post-task" className={\`\${styles.button} \${styles.buttonSecondary}\`}>
                Post a job
              </Link>
              <div className={styles.avatar} aria-hidden="true">
                <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} />
              </div>
            </div>`;

const headerActionsReplacement = `<div className={styles.headerActions}>
              <Link href="/post-task" className={\`\${styles.button} \${styles.buttonSecondary}\`}>
                Post a job
              </Link>
              {isAuth ? (
                <Link href={getDashboardLink()} style={{ textDecoration: 'none' }}>
                  <div className={styles.avatar} style={{ background: '#ff4500', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {userInitials || "U"}
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/login" className={\`\${styles.button} \${styles.buttonSecondary}\`} style={{ border: 'none', background: 'transparent' }}>
                    Log in
                  </Link>
                  <Link href="/signup" className={\`\${styles.button} \${styles.buttonPrimary}\`} style={{ padding: '8px 16px', fontSize: '14px' }}>
                    Sign up
                  </Link>
                </>
              )}
            </div>`;

c = c.replace(headerActionsTarget, headerActionsReplacement);

// Also replace the mobile skeleton profile
const mobileProfileTarget = `<div className={styles.mobileProfile} aria-hidden="true">
              <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} />
            </div>`;

const mobileProfileReplacement = `<div className={styles.mobileProfile}>
              {isAuth ? (
                <Link href={getDashboardLink()} style={{ textDecoration: 'none' }}>
                  <div className={styles.avatar} style={{ background: '#ff4500', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {userInitials || "U"}
                  </div>
                </Link>
              ) : (
                <Link href="/login" style={{ color: '#0f172a' }}>
                  <iconify-icon icon="lucide:user" style={{ fontSize: '24px' }}></iconify-icon>
                </Link>
              )}
            </div>`;

c = c.replace(mobileProfileTarget, mobileProfileReplacement);

fs.writeFileSync(p, c);
