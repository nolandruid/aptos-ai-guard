import React, { useState } from "react";
import { mapToFiveScale } from "../utils/mappers";

export const TrustLevelSlider = ({
  riskScore,
}: {
    riskScore: number;
}) => {

  const mappedValue = mapToFiveScale(riskScore);
  
  const getTrustLabel = (num: number) => {
    if (num < 2) return "Very Risky";
    if (num < 3.5) return "Moderate";
    if (num < 4.5) return "Good";
    return "Very Trustworthy";
  };

  // Dynamic slider track color from red to green
  const trackStyle = {
    background: `linear-gradient(to right, red 0%, orange ${
      riskScore * 50
    }%, #9ae600 100%)`,
  };

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <div className="flex items-center gap-0">
        {/* <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={riskScore}
          disabled
          className="w-full h-2 rounded-lg appearance-none cursor-not-allowed"
          style={trackStyle}
        /> */}
      </div>
      <div className="font-inter text-2xl text-primary-light text-center mt-4">
        {mappedValue}
        <br />
        <span className="font-inter text-xl font-bold text-primary-light">{getTrustLabel(parseFloat(mappedValue))}</span>
      </div>
    </div>
  );
}
