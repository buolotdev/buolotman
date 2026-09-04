import os
import zipfile
from pathlib import Path

def make_clean_zip():
    root_dir = Path(r"c:\Users\User-PC\Desktop\buolotman-main\buolotman-main")
    output_zip = Path(r"c:\Users\User-PC\Desktop\boulotman-source-with-env.zip")
    
    # Exclude directories that can be reinstalled or are build artifacts
    exclude_dirs = {
        "node_modules",
        ".next",
        "venv",
        ".venv",
        "__pycache__",
        ".git",
        ".turbo",
        "dist",
        "build",
        ".idea",
        ".vscode"
    }

    # Exclude archive extensions and log transcripts
    exclude_exts = {".zip", ".tar.gz", ".tgz", ".jsonl", ".pyc", ".pyo"}

    print(f"Creating clean zip archive at: {output_zip}")
    total_files = 0

    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith(".venv")]
            
            for file in files:
                if any(file.lower().endswith(ext) for ext in exclude_exts):
                    continue

                file_path = Path(root) / file
                rel_path = file_path.relative_to(root_dir)
                
                # We specifically INCLUDE .env, .env.local, etc.
                zipf.write(file_path, arcname=str(rel_path))
                total_files += 1

    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"Successfully created zip with {total_files} files.")
    print(f"Archive Size: {size_mb:.2f} MB")
    print(f"Location: {output_zip}")

if __name__ == "__main__":
    make_clean_zip()
