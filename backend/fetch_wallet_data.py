# wallet_features.py

import requests
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Set

BASE_URL: str = "https://fullnode.testnet.aptoslabs.com/v1"

# Setup logger once
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

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
        return 0
    return 1

def get_wallet_features(address: str) -> Dict[str, Any]:
    txs = get_transactions(address)
    if not txs:
        return {}

    tx_count = len(txs)
    total_sent, received_amount = 0.0, 0.0
    peers, active_days, timestamps = set(), set(), []

    for tx in txs:
        if tx.get("type") != "user_transaction":
            continue
        payload = tx.get("payload", {})
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

    avg_amount = total_sent / tx_count if tx_count else 0
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
        "tx_count": tx_count,
        "avg_amount_sent": round(avg_amount, 4),
        "unique_peers": len(peers),
        "days_active": len(active_days),
        "received_amount": round(received_amount, 4),
        "wallet_age_days": wallet_age_days,
        "last_active_days_ago": last_active_days_ago,
        "nfts_owned": nfts_owned,
        "token_types_held": len(fungible_tokens)
    }
