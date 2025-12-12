import React from 'react';
import { motion } from 'framer-motion';

const ScoreGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s) => {
    if (s < 30) return '#22c55e'; // Green
    if (s < 60) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-700 opacity-20"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="40"
          stroke={getColor(score)}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold">{score}%</span>
        <span className="text-xs text-gray-500">Plagiarism</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
