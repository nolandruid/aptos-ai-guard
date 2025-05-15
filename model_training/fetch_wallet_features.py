import requests
import csv
import os
import time
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Set
from collections import Counter

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# Constants
INPUT_CSV: str = "Data/raw/wallet_addresses.csv"
OUTPUT_CSV: str = "Data/raw/wallet_features.csv"
BASE_URL: str = "https://fullnode.testnet.aptoslabs.com/v1"

def read_wallets(csv_path: str) -> List[str]:
    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        return [row["wallet_address"] for row in reader]

def get_transactions(address: str, limit: int = 50) -> List[Dict[str, Any]]:
    url: str = f"{BASE_URL}/accounts/{address}/transactions?limit={limit}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as e:
        if response.status_code == 404:
            logging.warning(f"⚠️ No transactions found for {address}")
        else:
            logging.warning(f"⚠️ Failed to fetch transactions for {address}: {e}")
        return []
    except requests.RequestException as e:
        logging.warning(f"⚠️ Error fetching transactions for {address}: {e}")
        return []

def get_account_resources(address: str) -> List[Dict[str, Any]]:
    url: str = f"{BASE_URL}/accounts/{address}/resources"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logging.warning(f"⚠️ Failed to fetch resources for {address}: {e}")
        return []

def label_wallet(tx_count: int, peer_count: int) -> int:
    if tx_count <= 5 and peer_count <= 1:
        return 0  # suspicious
    return 1  # treat both trusted and unknown as '1'

def extract_features(address: str) -> Dict[str, Any]:
    txs = get_transactions(address)
    if not txs:
        return {}

    tx_count: int = len(txs)
    total_sent: float = 0.0
    received_amount: float = 0.0
    peers: Set[str] = set()
    active_days: Set[str] = set()
    timestamps: List[datetime] = []

    for tx in txs:
        if tx.get("type") != "user_transaction":
            continue

        payload: Dict[str, Any] = tx.get("payload", {})
        args = payload.get("arguments", [])

        if payload.get("function") == "0x1::coin::transfer" and len(args) == 2:
            try:
                amount = int(args[1]) / 1e8
                total_sent += amount
                peers.add(args[0])
                if args[0] == address:
                    received_amount += amount
            except (ValueError, IndexError):
                continue

        try:
            timestamp = int(tx.get("timestamp", "0")) / 1e6
            dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
            active_days.add(dt.date().isoformat())
            timestamps.append(dt)
        except Exception:
            continue

    avg_amount: float = total_sent / tx_count if tx_count else 0
    now = datetime.now(timezone.utc)
    wallet_age_days = (now - min(timestamps)).days if timestamps else 0
    last_active_days_ago = (now - max(timestamps)).days if timestamps else -1

    resources = get_account_resources(address)
    nfts_owned = 0
    fungible_tokens = set()

    for res in resources:
        res_type = res.get("type", "")
        if "token::Token" in res_type or "token::TokenStore" in res_type:
            nfts_owned += 1
        if "fungible_asset::FungibleStore" in res_type:
            fungible_tokens.add(res_type)

    return {
        "wallet_address": address,
        "tx_count": tx_count,
        "avg_amount_sent": round(avg_amount, 4),
        "unique_peers": len(peers),
        "days_active": len(active_days),
        "received_amount": round(received_amount, 4),
        "wallet_age_days": wallet_age_days,
        "last_active_days_ago": last_active_days_ago,
        "nfts_owned": nfts_owned,
        "token_types_held": len(fungible_tokens),
        "label": label_wallet(tx_count, len(peers))
    }

def save_features(rows: List[Dict[str, Any]], path: str) -> None:
    if not rows:
        logging.warning("⚠️ No features to save.")
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    temp_path = path + ".tmp"
    with open(temp_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    os.replace(temp_path, path)
    logging.info(f"✅ Safely saved {len(rows)} wallet features to {path}")

if __name__ == "__main__":
    wallets: List[str] = read_wallets(INPUT_CSV)
    features: List[Dict[str, Any]] = []

    for i, addr in enumerate(wallets):
        logging.info(f"🔍 Processing {i+1}/{len(wallets)}: {addr}")
        row = extract_features(addr)
        if row:
            features.append(row)
        time.sleep(0.3)

    save_features(features, OUTPUT_CSV)

    skipped = len(wallets) - len(features)
    logging.info(f"🚫 Skipped {skipped} wallets with no transactions")

    label_dist = Counter(row["label"] for row in features)
    logging.info(f"📊 Label distribution: {dict(label_dist)}")