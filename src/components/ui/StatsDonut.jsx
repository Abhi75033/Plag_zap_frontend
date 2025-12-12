import React from 'react';
import { motion } from 'framer-motion';

const StatsDonut = ({ plagiarized, paraphrased, unique, size = 180, strokeWidth = 15 }) => {
  const total = plagiarized + paraphrased + unique || 1; // Avoid divide by zero
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages
  const plagiarizedPercent = (plagiarized / total);
  const paraphrasedPercent = (paraphrased / total);
  const uniquePercent = (unique / total);

  // Calculate stroke offsets
  // The circle starts at 3 o'clock by default, we want 12 o'clock, so -90deg rotation in CSS
  const uniqueOffset = 0;
  const paraphrasedOffset = -1 * (uniquePercent * circumference);
  const plagiarizedOffset = -1 * ((uniquePercent + paraphrasedPercent) * circumference);

  const CircleSegment = ({ color, percent, offset, delay }) => (
    <motion.circle
      cx={center}
      cy={center}
      r={radius}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      initial={{ strokeDashoffset: circumference }}
      animate={{ strokeDashoffset: circumference * (1 - percent) }}
      transition={{ duration: 1.5, ease: "easeOut", delay }}
      strokeLinecap="round"
      style={{ rotate: -90, transformOrigin: "center", strokeDashoffset: offset }} // Offset handling logic is complex with dashoffset, simplifying below
    />
  );
  
  // Simplified stacked approach:
  // We draw 3 circles on top of each other. 
  // 1. Base (Unique Color) - Full Circle
  // 2. Paraphrased + Plagiarized - partially filled
  // 3. Plagiarized - partially filled on top
  
  // Actually, better SVG approach for true segments:
  // Use stroke-dasharray: [length of segment, space]
  
  const getSegmentProps = (percent, rotationOffset = 0) => {
     const length = percent * circumference;
     const gap = circumference - length;
     return {
        strokeDasharray: `${length} ${gap}`,
        rotate: rotationOffset - 90
     };
  };

  const pRot = (uniquePercent * 360);
  const plRot = ((uniquePercent + paraphrasedPercent) * 360);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />

        {/* Unique Segment (Green) */}
        {unique > 0 && (
            <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#10b981" // emerald-500
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${uniquePercent * circumference} ${circumference}` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ rotate: -90, transformOrigin: 'center' }}
            />
        )}

        {/* Paraphrased Segment (Orange) */}
        {paraphrased > 0 && (
             <motion.circle
             cx={center}
             cy={center}
             r={radius}
             fill="transparent"
             stroke="#f97316" // orange-500
             strokeWidth={strokeWidth}
             strokeLinecap="butt"
             initial={{ strokeDasharray: `0 ${circumference}` }}
             animate={{ strokeDasharray: `${paraphrasedPercent * circumference} ${circumference}` }}
             transition={{ duration: 1, ease: "easeOut", delay: 0.5 }} // delay to start after green
             style={{ rotate: -90 + (uniquePercent * 360), transformOrigin: 'center' }}
           />
        )}

        {/* Plagiarized Segment (Red) */}
        {plagiarized > 0 && (
            <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#ef4444" // red-500
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${plagiarizedPercent * circumference} ${circumference}` }}
            transition={{ duration: 1, ease: "easeOut", delay: 1 }} // delay to start after orange
            style={{ rotate: -90 + ((uniquePercent + paraphrasedPercent) * 360), transformOrigin: 'center' }}
          />
        )}
        
      </svg>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="text-center"
          >
              <div className="text-3xl font-black text-white">
                  {Math.round((plagiarizedPercent + paraphrasedPercent) * 100)}%
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  AI Probability
              </div>
          </motion.div>
      </div>
    </div>
  );
};

export default StatsDonut;
