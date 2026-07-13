import os

def update_tsx_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    target_block = """            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>"""
            
    replacement = """            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>"""
            
    if target_block in content:
        content = content.replace(target_block, replacement)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
def update_css_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if '.brandEyebrow' not in content:
        content += "\n.brandEyebrow { color: rgba(254,254,255,.66); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px; display: block; }\n"
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\app\dashboard\client"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            update_tsx_file(os.path.join(root, file))
        elif file.endswith('.module.css'):
            update_css_file(os.path.join(root, file))

print("All client dashboard files updated with Boulot Man text above Client Space!")
