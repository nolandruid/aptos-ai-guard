export const verifyRisk = async ({ addressWallet }: { addressWallet: string }) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/risk_score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet_address: addressWallet,
      }),
    });

    const data = await response.json()

    return {
        wallet_address: data.wallet_address,
        label: data.label,
        confidenceScore: data.confidence,
        message: "Ok"
    }
  } catch (error) {
    console.error("Error verifying risk:", error);
    return {
        wallet_address: "",
        label: "",
        confidenceScore: 0,
        message: "Failed to verify risk",
    };
  }
};
