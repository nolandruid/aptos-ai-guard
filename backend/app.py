from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/risk_score', methods=['GET'])
def risk_score():
    dummy_response = {
        "label": "Trusted",
        "confidence": 0.95
    }
    return jsonify(dummy_response)

if __name__ == '__main__':
    app.run(debug=True)
