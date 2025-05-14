import subprocess
import os
import logging
from typing import List

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

DATA_DIR = "."  # This script is placed inside the 'Data' folder

def dvc_add_or_update(folder: str, csv_files: List[str]) -> None:
    """Add or update CSV files in DVC."""
    for file in csv_files:
        logging.info(f"📦 Adding/Updating with DVC: {os.path.join(folder, file)}")
        try:
            subprocess.run(["dvc", "add", file], cwd=folder, check=True)
        except subprocess.CalledProcessError as e:
            logging.warning(f"❌ Failed to add {file} to DVC in {folder}: {e}")

    dvc_files = [f + ".dvc" for f in csv_files if os.path.exists(os.path.join(folder, f + ".dvc"))]
    if dvc_files:
        subprocess.run(["git", "add"] + dvc_files + [".gitignore"], cwd=folder, check=True)
        subprocess.run(["git", "commit", "-m", f"Update DVC-tracked files in {folder}"], cwd=folder, check=True)

def track_all_data_folders(data_dir: str) -> None:
    """Track all datasets in subfolders of the Data directory."""
    for subfolder in os.listdir(data_dir):
        if subfolder.startswith("."):  # skip .git, .ipynb_checkpoints etc.
            continue
        full_path = os.path.join(data_dir, subfolder)
        if os.path.isdir(full_path):
            logging.info(f"📁 Entering folder: {full_path}")
            csv_files = [f for f in os.listdir(full_path) if f.endswith(".csv")]
            if csv_files:
                dvc_add_or_update(full_path, csv_files)

if __name__ == "__main__":
    track_all_data_folders(DATA_DIR)