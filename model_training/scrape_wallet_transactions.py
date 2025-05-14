import requests
import csv
import os
import time
from typing import List, Set, Dict

# Constants
BASE_URL: str = "https://fullnode.testnet.aptoslabs.com/v1"
WALLETS_CSV: str = "Data/raw/wallet_addresses.csv"
TXS_PER_PAGE: int = 100
PAGES: int = 20
DELAY: float = 0.25

def get_latest_version() -> int:
    """Fetch the latest transaction version number."""
    url = f"{BASE_URL}/transactions?limit=1"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    txs = response.json()
    if not txs or "version" not in txs[0]:
        raise ValueError("Could not find latest transaction version.")
    return int(txs[0]["version"])

def get_transactions(start: int, limit: int = TXS_PER_PAGE) -> List[Dict]:
    """Get a batch of transactions starting from a version."""
    url: str = f"{BASE_URL}/transactions?start={start}&limit={limit}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"❌ Error fetching transactions at start={start}: {e}")
        return []

def extract_wallets(transactions: List[Dict]) -> Set[str]:
    """Extract sender/receiver/store wallet addresses from txs."""
    wallet_set: Set[str] = set()
    for tx in transactions:
        if tx.get("type") == "user_transaction":
            sender: str = tx.get("sender", "")
            if sender:
                wallet_set.add(sender)

            payload: Dict = tx.get("payload", {})
            if payload.get("function") == "0x1::coin::transfer":
                arguments: List = payload.get("arguments", [])
                if arguments and isinstance(arguments[0], str):
                    wallet_set.add(arguments[0])

            for event in tx.get("events", []):
                store = event.get("data", {}).get("store")
                if store and isinstance(store, str) and store.startswith("0x"):
                    wallet_set.add(store)
    return wallet_set

def save_to_csv(wallets: Set[str], path: str) -> None:
    """Write wallet addresses to a CSV via safe atomic replacement."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    try:
        temp_path = path + ".tmp"
        with open(temp_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["wallet_address"])
            for addr in wallets:
                writer.writerow([addr])
        os.replace(temp_path, path)
        print(f"✅ Safely saved {len(wallets)} unique wallet addresses to {path}")
    except Exception as e:
        print(f"❌ Error saving to CSV: {e}")

# -------------------------
# Main routine
# -------------------------
if __name__ == "__main__":
    try:
        latest_version: int = get_latest_version()
        print(f"🔍 Latest transaction version: {latest_version}")

        all_wallets: Set[str] = set()

        for i in range(PAGES):
            start = latest_version - ((i + 1) * TXS_PER_PAGE)
            print(f"📦 Fetching transactions {start} to {start + TXS_PER_PAGE}...")
            txs = get_transactions(start)
            if not txs:
                print("⚠️ No transactions found.")
                continue
            new_wallets = extract_wallets(txs)
            print(f"➕ Found {len(new_wallets)} new wallet addresses")
            all_wallets.update(new_wallets)
            time.sleep(DELAY)

        save_to_csv(all_wallets, WALLETS_CSV)

    except Exception as e:
        print(f"❌ Fatal error: {e}")