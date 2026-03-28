import React, { useEffect, useRef } from 'react';

interface Props {
  score: number;
  label: string;
}

const ReadinessGauge: React.FC<Props> = ({ score, label }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      // 1. Set initial state without using the 'style' prop in JSX
      circleRef.current.style.strokeDasharray = `${circumference}`;
      
      // 2. Calculate and set the progress offset
      const offset = circumference - (score / 100) * circumference;
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [score, circumference]);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          {/* Progress Circle (No inline style prop here) */}
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            className="text-blue-600 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-gray-900 leading-none">{score}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">ReadySCORE</span>
        </div>
      </div>
      <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
};

export default ReadinessGauge;