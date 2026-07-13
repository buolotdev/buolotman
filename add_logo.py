import os

def update_tsx_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'import Image from "next/image";' not in content:
        content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Image from "next/image";')
        
    target_block = """            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h1 className={styles.sidebarTitle}>Client Space</h1>
            </div>"""
            
    target_block2 = """            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h2 className={styles.sidebarTitle}>Client Space</h2>
            </div>"""
            
    replacement = """            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={180} height={46} className={styles.brandImage} priority />
            </Link>"""
            
    content = content.replace(target_block, replacement)
    content = content.replace(target_block2, replacement)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
def update_css_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if '.brandImage' not in content:
        content += "\n.brand { display: inline-flex; align-items: center; text-decoration: none; }\n.brandImage { width: auto; height: 54px; object-fit: contain; }\n"
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\app\dashboard\client"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            update_tsx_file(os.path.join(root, file))
        elif file.endswith('.module.css'):
            update_css_file(os.path.join(root, file))

print("All client dashboard files updated with the logo!")
