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
    }%, green 100%)`,
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        Trust Level
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={riskScore}
          disabled
          className="w-full h-2 rounded-lg appearance-none cursor-not-allowed"
          style={trackStyle}
        />
      </div>
      <div className="mt-4 text-center text-xl font-bold text-gray-800">
        {mappedValue} - {getTrustLabel(parseFloat(mappedValue))}
      </div>
    </div>
  );
}
