# AptosAI Guard

ML-backed wallet risk detector for Aptos transactions

## Overview

AptosAI Guard is a sophisticated wallet risk detection application that leverages machine learning to analyze and assess the risk level of Aptos blockchain transactions. The application consists of a Flask backend API and a React frontend interface, providing real-time risk scoring and transaction analysis.

## Loom Video Walkthrough

[Insert Loom video link here]

## UI Screenshots

| Home Page | Risk Score Result |
|-----------|------------------|
| ![Home Screenshot](ui/result/home_screenshot.jpg) | ![Risk Score Screenshot](ui/result/risk_score_screenshot.jpg) |

_Add more screenshots as needed._

## Features

- Real-time transaction risk scoring
- Machine learning-powered risk assessment
- User-friendly web interface
- Secure API endpoints
- Integration with Aptos blockchain

## Project Structure
```text
aptos-ai-guard/
├── backend/         # Flask API server
├── frontend/        # React web application
├── model/           # ML model and risk scoring logic
├── model_training/  # Training scripts and data
└── requirements.txt # Python dependencies
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Aptos CLI (optional, for development)

## Installation

1. Clone the repository:
```text
git clone https://github.com/yourusername/aptos-ai-guard.git
cd aptos-ai-guard
```

2. Set up the backend:
```text
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt
```

3. Set up the frontend:
```text
cd ../frontend
npm install  # or yarn install
```

## Running the Application

1. Start the backend server:
```text
cd backend
flask run
```

2. Start the frontend development server:
```text
cd ../frontend
npm start  # or yarn start
```

The application will be available at http://localhost:3000

## API Documentation

The backend API provides the following endpoints:

- POST /api/risk-score: Calculate risk score for a transaction
- GET /api/transaction-history: Retrieve transaction history
- More endpoints to be documented...

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Aptos Blockchain
- Flask Framework
- React
- scikit-learn
