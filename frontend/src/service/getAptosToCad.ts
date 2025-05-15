export const getAptosToCad = async (amount: number) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/aptos_to_cad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
        });

        const data = await response.json();

        return {
            cadValue: data.cad_value,
            message: "Ok",
        };
    } catch (error) {
        console.error("Error converting APT to CAD:", error);
        return {
            cadValue: 0,
            message: "Failed to convert",
        };
    }
};