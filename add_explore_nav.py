import os

def update_tsx_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove the hint and link from the footer if it exists
    footer_block = """          <div className={styles.sidebarFooter}>
            <p className={styles.sidebarHint}>Need more help?</p>
            <Link href="/search" className={styles.sidebarLink}>Explore professionals</Link>
            <LogoutButton className={styles.logoutButton} />
          </div>"""
          
    footer_replacement = """          <div className={styles.sidebarFooter}>
            <LogoutButton className={styles.logoutButton} />
          </div>"""
          
    content = content.replace(footer_block, footer_replacement)
    
    # Add Explore Professionals to navItems
    nav_search_entry = '  { key: "explore", label: "Explore Professionals", icon: "lucide:search", href: "/search", match: (p: string) => p.startsWith("/search") },\n'
    
    if "key: \"explore\"" not in content:
        # Find where navItems is defined and add it at the end of the list
        profile_nav = '  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/client/profile", match: (p: string) => p.startsWith("/dashboard/client/profile") },'
        
        if profile_nav in content:
            content = content.replace(profile_nav, profile_nav + '\n' + nav_search_entry)
            
    # Make sidebar scrollable just in case
    # This needs to be done in css but we can do it later
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def update_css_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Add overflow-y to sidebar
    old_sidebar = ".sidebar { position: sticky; top: 0; display: flex; flex-direction: column; min-height: 100vh; background: linear-gradient(180deg, #001f3f 0%, #00172e 100%); color: #fefeff; border-right: 1px solid rgba(255,255,255,.08); }"
    new_sidebar = ".sidebar { position: sticky; top: 0; display: flex; flex-direction: column; height: 100vh; overflow-y: auto; background: linear-gradient(180deg, #001f3f 0%, #00172e 100%); color: #fefeff; border-right: 1px solid rgba(255,255,255,.08); }"
    
    if old_sidebar in content:
        content = content.replace(old_sidebar, new_sidebar)
        
    # Hide scrollbar for webkit to keep it clean
    if "::-webkit-scrollbar" not in content:
        content += "\n.sidebar::-webkit-scrollbar { display: none; }\n.sidebar { -ms-overflow-style: none; scrollbar-width: none; }\n"
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


base_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\app\dashboard\client"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            update_tsx_file(os.path.join(root, file))
        elif file.endswith('.module.css'):
            update_css_file(os.path.join(root, file))

print("Explore Professionals nav added and sidebar scroll enabled!")
