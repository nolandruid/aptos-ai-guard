import os
import joblib

# Path to the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model_training/Trained Model/LR_Trained_Model.pkl')

# Map model class indices to labels
CLASS_LABELS = ['Trusted', 'Low Activity', 'Suspicious']


def get_risk_score(wallet_data):
    """
    Calculate a risk score for an Aptos wallet using a pre-trained RandomForest model.
    Args:
        wallet_data (dict): Dictionary with keys: address, tx_count, unique_peers, avg_amount_sent, days_active, nfts_owned
    Returns:
        dict: { 'address': str, 'score': float (0.0-5.0), 'status': str }
    """
    try:
        # Load the trained model
        model = joblib.load(MODEL_PATH)

        # Prepare features in the expected order
        features = [
            wallet_data.get('tx_count', 0),
            wallet_data.get('unique_peers', 0),
            wallet_data.get('avg_amount_sent', 0.0),
            wallet_data.get('days_active', 0),
            wallet_data.get('nfts_owned', 0)
        ]

        # Predict class probabilities
        probs = model.predict_proba([features])[0]
        # Get the index of the highest probability class
        top_class_idx = probs.argmax()
        top_class_label = CLASS_LABELS[top_class_idx]
        top_prob = probs[top_class_idx]

        # Convert probabilities to a risk score (0-5)
        if top_class_label == 'Suspicious':
            score = 2.0 * top_prob  # 0-2
            if score < 2.0:
                status = 'High Risk'
            else:
                status = 'Low Risk'
        elif top_class_label == 'Low Activity':
            score = 2.0 + 1.0 * top_prob  # 2-3
            status = 'Low Risk'
        else:  # Trusted
            score = 3.0 + 2.0 * top_prob  # 3-5
            if score < 4.0:
                status = 'Moderate Safe'
            else:
                status = 'Safe'

        # Clamp score to 0.0-5.0
        score = max(0.0, min(5.0, float(score)))

        return {
            'address': str(wallet_data.get('address', '')),
            'score': round(score, 2),
            'status': status
        }
    except Exception as e:
        # Error handling: return default score
        return {
            'address': str(wallet_data.get('address', '')),
            'score': 1.0,
            'status': 'High Risk'
        } 