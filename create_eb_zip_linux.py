import os
import zipfile

def zip_backend():
    backend_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\backend"
    zip_path = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\aws-eb-perfect.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(backend_dir):
            if 'venv' in root or '__pycache__' in root or '.git' in root or '.next' in root:
                continue
                
            for file in files:
                if file.endswith('.sqlite3') or file.endswith('.sqlite3-journal') or file.endswith('.db'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, backend_dir)
                # FORCE FORWARD SLASHES FOR LINUX
                linux_path = rel_path.replace("\\", "/")
                zinfo = zipfile.ZipInfo(linux_path)
                zinfo.compress_type = zipfile.ZIP_DEFLATED
                if linux_path.endswith('.sh') or 'hooks' in linux_path:
                    zinfo.external_attr = 0o755 << 16  # rwxr-xr-x
                else:
                    zinfo.external_attr = 0o644 << 16  # rw-r--r--
                with open(file_path, 'rb') as f:
                    zipf.writestr(zinfo, f.read())
                    
    print(f"Created {zip_path}")
    final_zip_path = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main\aws-eb-final.zip"
    import shutil
    shutil.copyfile(zip_path, final_zip_path)
    print(f"Synced {final_zip_path}")

if __name__ == "__main__":
    zip_backend()
