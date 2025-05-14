from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/risk_score', methods=['POST'])
def risk_score():
    data = request.get_json()
    recipient = data.get('recipient')

    dummy_response = {
        "recipient": recipient,
        "label": "Trusted",
        "confidence": 0.95
    }
    return jsonify(dummy_response)

if __name__ == '__main__':
    app.run(debug=True)
