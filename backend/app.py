from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import time

# cache
cached_price = None
last_fetched_time = 0
CACHE_DURATION = 60 

try:
    model_path = os.path.join(
        os.path.dirname(__file__),
        '..',  
        'model_training',
        'Trained Model',
        'LR_Trained_Model.pkl'
    )
    model_path = os.path.abspath(model_path)
    import joblib
    model = joblib.load(model_path)
    model_loaded = True
    print('loaded ', model_path)
except:
    model = None
    model_loaded = False
    print('failed to load ', model_path)

try:
    from fetch_wallet_data import get_wallet_features as fetch_wallet_data
except ImportError:
    def fetch_wallet_data(wallet_address):
        return {
            "tx_count": 42,
            "unique_peers": 5,
            "avg_amount_sent": 2.35,
            "days_active": 10,
            "received_amount": 1.5,
            "wallet_age_days": 120,
            "last_active_days_ago": 3,
            "nfts_owned": 2,
            "token_types_held": 1,
            "wallet_address": wallet_address,
            "label": 1  # Optional, not used by model
        }

app = Flask(__name__)
CORS(app)

@app.route('/risk_score', methods=['POST'])
def risk_score():
    data = request.get_json()
    wallet_address = data.get('wallet_address')

    if not wallet_address:
        return jsonify({"error": "Missing 'wallet_address'", "wallet_found": False}), 400

    features_dict = fetch_wallet_data(wallet_address)
    if not features_dict:
        # Wallet not found or no transactions
        return jsonify({
            "wallet_address": wallet_address,
            "label": "High Risk",
            "confidence": 0.0,
            "wallet_found": False,
            "error": "Wallet not found or no transactions"
        }), 404

    features = [
        features_dict["tx_count"],
        features_dict["unique_peers"],
        features_dict["avg_amount_sent"],
        features_dict["days_active"],
        features_dict["received_amount"],
        features_dict["wallet_age_days"],
        features_dict["last_active_days_ago"],
        features_dict["nfts_owned"],
        features_dict["token_types_held"]
    ]
    print('Loaded ', wallet_address, ' --> ',features)
    if model_loaded:    
        label_raw = model.predict([features])[0]
        confidence = model.predict_proba([features]).max()
        label = "Trusted" if label_raw == 1 else "Suspicious"
    else:
        # dummy result
        label = "Trusted"
        confidence = 0.87

    result = {
        "wallet_address": wallet_address,
        "label": label,
        "confidence": round(float(confidence), 2),
        "wallet_found": True
    }
    return jsonify(result)


@app.route('/aptos_to_cad', methods=['POST'])
def aptos_to_cad():
    global cached_price, last_fetched_time
    
    data = request.get_json()
    amount = data.get("amount")

    if amount is None:
        return jsonify({"error": "Missing 'amount' in request"}), 400

    try:
        # Call CoinGecko API 
        now = time.time()
        if cached_price is None or (now - last_fetched_time) > CACHE_DURATION:
            url = "https://api.coingecko.com/api/v3/simple/price"
            params = {
                "ids": "aptos",
                "vs_currencies": "cad"
            }
            response = requests.get(url, params=params, timeout=10)

            if response.status_code == 429:
                return jsonify({
                    "error": "Rate limit exceeded. Try again shortly."
                }), 429

            response.raise_for_status()
            price_data = response.json()
            cached_price = price_data["aptos"]["cad"]
            last_fetched_time = now

        total_value = round(float(amount) * cached_price, 2)

        return jsonify({
            "amount": amount,
            "cad_value": total_value,
            # "cached_at": int(last_fetched_time)
        })

    except Exception as e:
        return jsonify({"error": f"Failed to fetch price: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
