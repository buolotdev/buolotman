import os
import zipfile

def package_eb():
    backend_dir = os.path.abspath('backend')
    output_zip = os.path.abspath('aws-eb-final.zip')

    excluded_dirs = {'venv', '.venv', '__pycache__', '.git', 'staticfiles'}
    excluded_extensions = {'.pyc', '.pyo', '.pyd'}

    print(f"Creating clean zip package: {output_zip}")
    count = 0
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(backend_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in excluded_dirs and (not d.startswith('.') or d in {'.ebextensions', '.platform'})]
            
            for file in files:
                if any(file.endswith(ext) for ext in excluded_extensions):
                    continue
                if file.startswith('.') and file not in {'.env.example'}:
                    # Only allow files inside .ebextensions or .platform
                    rel_dir = os.path.relpath(root, backend_dir)
                    if not (rel_dir.startswith('.ebextensions') or rel_dir.startswith('.platform')):
                        continue
                
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, backend_dir)
                
                # Check that none of the parent parts are excluded
                parts = rel_path.split(os.sep)
                if any(p in excluded_dirs for p in parts):
                    continue

                zf.write(full_path, rel_path)
                count += 1

    print(f"Successfully packaged {count} files into {output_zip} (Size: {os.path.getsize(output_zip) / (1024*1024):.2f} MB)")

if __name__ == '__main__':
    package_eb()
