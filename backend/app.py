from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

# Connect TBD - model.pkl
try:
    model_path = os.path.join(os.path.dirname(__file__), 'ml', 'model.pkl')
    import joblib
    model = joblib.load('model.pkl')
    model_loaded = True
except:
    model = None
    model_loaded = False

# Connect TBD - fetch_wallet_data.py
try:
    from fetch_wallet_data import get_wallet_features  # fetches wallet features as a dict
except ImportError:
    def get_wallet_features(wallet_address):
        return {
            "address": wallet_address,
            "tx_count": 42,
            "unique_peers": 5,
            "avg_amount_sent": 2.35,
            "days_active": 10,
            "nfts_owned": 1
        }

try:
    import sys
    sys.path.append(os.path.join(os.path.dirname(__file__), '../model'))
    from risk_score import get_risk_score
except ImportError:
    def get_risk_score(wallet_data):
        return {
            'address': wallet_data.get('address', ''),
            'score': 1.0,
            'status': 'High Risk'
        }

app = Flask(__name__)
CORS(app)

@app.route('/risk_score', methods=['POST'])
def risk_score():
    data = request.get_json()
    wallet_address = data.get('wallet_address')

    if not wallet_address:
        return jsonify({"error": "Missing 'wallet_address'"}), 400

    features_dict = get_wallet_features(wallet_address)
    # Call the ML risk scoring function
    result = get_risk_score(features_dict)

    return jsonify(result)


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
