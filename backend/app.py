from flask import Flask, request, jsonify
import os

# Connect TBD - model.pkl
try:
    import joblib
    model = joblib.load('model.pkl')
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
    recipient = data.get('recipient')

    if not recipient:
        return jsonify({"error": "Missing 'recipient'"}), 400

    features_dict = fetch_wallet_data(recipient)
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
        "recipient": recipient,
        "label": label,
        "confidence": round(float(confidence), 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
