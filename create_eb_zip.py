import os
import zipfile

def zip_backend():
    backend_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\backend"
    zip_path = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\aws-eb-final.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(backend_dir):
            # Exclude virtual environments and caches
            if 'venv' in root or '__pycache__' in root or '.git' in root:
                continue
                
            for file in files:
                file_path = os.path.join(root, file)
                # Calculate relative path to put in zip root
                rel_path = os.path.relpath(file_path, backend_dir)
                zipf.write(file_path, rel_path)
                
    print(f"Created {zip_path}")

if __name__ == "__main__":
    zip_backend()
