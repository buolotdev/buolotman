import os

def update_tsx_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    target_1 = """          <Link href="/" className={styles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={180} height={46} className={styles.brandImage} priority />
          </Link>"""
          
    target_2 = """          <Link href="/" className={styles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={180} height={46} className={styles.brandImage} priority />
          </Link>"""

    # Some might use slightly different spacing or formatting, let's use a simpler replace
    import re
    # We want to replace the whole <Link ... styles.brand ...> ... </Link> block inside <div className={styles.sidebarHeader}>
    
    # We'll just do a string replace since it's likely identical
    replacement = """          <Link href="/" className={styles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
            <div className={styles.brandText}>
              <span className={styles.brandEyebrow}>Boulot Man</span>
              <span className={styles.brandTitle}>Company Space</span>
            </div>
          </Link>"""
          
    if target_1 in content:
        content = content.replace(target_1, replacement)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def update_css_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    css_addition = """
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.brandImage { width: 48px; height: 48px; object-fit: contain; }
.brandText { display: flex; flex-direction: column; }
.brandEyebrow { color: rgba(254,254,255,.66); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px; display: block; }
.brandTitle { color: #fff; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
"""
    
    # replace old brand css block
    old_css_start = ".brand {"
    old_css_end = ".navMenu {"
    
    if ".brandEyebrow" not in content and ".brandTitle" not in content:
        content += css_addition
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\app\dashboard\company"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            update_tsx_file(os.path.join(root, file))
        elif file.endswith('.module.css'):
            update_css_file(os.path.join(root, file))

print("Logo updated for Company space!")
