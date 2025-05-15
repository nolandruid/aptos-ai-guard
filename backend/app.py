from flask import Flask, request, jsonify
import os
import requests

# Connect TBD - model.pkl
try:
    model_path = os.path.join(os.path.dirname(__file__), 'ml', 'model.pkl')
    import joblib
    model = joblib.load(model_path)
    model_loaded = True
except:
    model = None
    model_loaded = False

# Connect TBD - fetch_wallet_data.py
try:
    from fetch_wallet_data import fetch_wallet_data
except ImportError:
    def fetch_wallet_data(wallet_address):
        return {
            "tx_count": 42,
            "unique_peers": 5,
            "avg_tx_amount": 2.35,
            "has_nft": 1,
            "days_since_first_tx": 77
        }

app = Flask(__name__)

@app.route('/risk_score', methods=['POST'])
def risk_score():
    data = request.get_json()
    wallet_address = data.get('wallet_address')

    if not wallet_address:
        return jsonify({"error": "Missing 'wallet_address'"}), 400

    features_dict = fetch_wallet_data(wallet_address)
    """
    Sample features:
    - tx_count: Total number of transactions
    - unique_peers: Number of unique wallet interactions
    - avg_tx_amount: Average transaction amount
    - has_nft: Whether the wallet holds any NFTs
    - days_since_first_tx: Age of the wallet (in days)
    """
    features = [
        features_dict["tx_count"],
        features_dict["unique_peers"],
        features_dict["avg_tx_amount"],
        features_dict["has_nft"],
        features_dict["days_since_first_tx"]
    ]

    if model_loaded:
        label_raw = model.predict([features])[0]
        confidence = model.predict_proba([features]).max()
        label = "Trusted" if label_raw == 1 else "Suspicious"
    else:
        # dummy result
        label = "Trusted"
        confidence = 0.87

    return jsonify({
        "wallet_address": wallet_address,
        "label": label,
        "confidence": round(float(confidence), 2)
    })


@app.route('/aptos_to_cad', methods=['POST'])
def aptos_to_cad():
    data = request.get_json()
    amount = data.get("amount")

    if amount is None:
        return jsonify({"error": "Missing 'amount' in request"}), 400

    try:
        # Call CoinGecko API 
        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {
            "ids": "aptos",
            "vs_currencies": "cad"
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        price_data = response.json()
        apt_to_cad = price_data["aptos"]["cad"]

        total_value = round(float(amount) * apt_to_cad, 2)

        return jsonify({
            "amount": amount,
            "cad_value": total_value
        })

    except Exception as e:
        return jsonify({"error": f"Failed to fetch price: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
