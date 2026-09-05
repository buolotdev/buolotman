import os
import zipfile

def zip_backend():
    backend_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\backend"
    zip_paths = [
        r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\aws-eb-final.zip",
        r"c:\Users\User-PC\Desktop\aws-eb-final.zip",
        r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\aws-eb-perfect.zip",
        r"c:\Users\User-PC\Desktop\aws-eb-perfect.zip",
    ]
    
    for zip_path in zip_paths:
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(backend_dir):
                # Exclude virtual environments, caches, and git
                if 'venv' in root or '__pycache__' in root or '.git' in root or '.next' in root:
                    continue
                    
                for file in files:
                    # Exclude journal lock files
                    if file.endswith('.sqlite3-journal'):
                        continue
                    file_path = os.path.join(root, file)

                    rel_path = os.path.relpath(file_path, backend_dir)
                    # Force Linux-compatible forward slashes
                    linux_path = rel_path.replace("\\", "/")
                    zipf.write(file_path, linux_path)

                    
        print(f"Created {zip_path} ({os.path.getsize(zip_path) / (1024*1024):.2f} MB)")

if __name__ == "__main__":
    zip_backend()
