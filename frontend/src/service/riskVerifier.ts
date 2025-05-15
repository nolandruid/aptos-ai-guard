export const verifyRisk = async ({ address }: { address: string }) => {
  try {
    const response = await fetch("http://localhost:5000/risk_score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
      }),
    });

    const data = await response.json()

    return {
        recipient: data.recipient,
        label: data.label,
        confidence: data.confidence,
    }
  } catch (error) {
    console.error("Error verifying risk:", error);
    return {
        isRisk: false,
        riskLevel: "",
        message: "Failed to verify risk",
    };
  }
};
