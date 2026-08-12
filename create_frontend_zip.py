import os
import zipfile
import shutil

def zip_frontend():
    root_dir = r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main"
    standalone_dir = os.path.join(root_dir, ".next", "standalone")
    zip_path = os.path.join(root_dir, "buolotman_frontend.zip")
    
    # Paths to additional required folders
    static_dir = os.path.join(root_dir, ".next", "static")
    public_dir = os.path.join(root_dir, "public")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # 1. Add everything inside .next/standalone to the root of the zip
        for root, dirs, files in os.walk(standalone_dir):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, standalone_dir)
                linux_path = rel_path.replace("\\", "/")
                zipf.write(file_path, linux_path)
                
        # 2. Add .next/static to .next/static inside the zip
        for root, dirs, files in os.walk(static_dir):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir) # This gives .next/static/...
                linux_path = rel_path.replace("\\", "/")
                zipf.write(file_path, linux_path)
                
        # 3. Add public to public inside the zip
        for root, dirs, files in os.walk(public_dir):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir) # This gives public/...
                linux_path = rel_path.replace("\\", "/")
                zipf.write(file_path, linux_path)
                
    print(f"Created {zip_path}")

if __name__ == "__main__":
    zip_frontend()
