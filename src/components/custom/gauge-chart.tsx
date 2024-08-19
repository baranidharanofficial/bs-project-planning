import React from 'react';

interface GaugeChartProps {
  percentage: number;
}

const GaugeChart = ({ percentage }: GaugeChartProps) => {
  const rotation = (percentage / 100) * 180;

  return (
    <div className="flex justify-center items-center mb-2">
      <div className="relative w-64 h-32 overflow-hidden">
        <div className="w-64 h-64 rounded-full border-8 border-gray-300 absolute top-0 left-0" />
        <div
          className="w-64 h-64 rounded-full border-8 border-green-500 absolute top-0 left-0"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <div className="w-56 h-56  rounded-full absolute top-[-20px] left-4 flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">{percentage}%</span>
          <p className="text-md text-neutral-400">Progress</p>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
