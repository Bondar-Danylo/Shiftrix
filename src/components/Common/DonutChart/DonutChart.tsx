// Imports
import React from "react";
import type { DonutChartProps, DonutSegment } from "./DonutChart.types";

const DonutChart: React.FC<DonutChartProps> = ({
  data = [],
  size = 100,
  strokeWidth = 10,
  className,
}) => {
  const radius: number = 40;
  const circumference: number = 2 * Math.PI * radius;
  const totalValue: number = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedAngle = 0;

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          transform: "rotate(-90deg)",
          width: "100%",
          height: "100%",
        }}
      >
        {totalValue === 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
        )}

        {totalValue > 0 &&
          data.map((segment: DonutSegment, index: number) => {
            const percentage: number = segment.value / totalValue;
            const strokeLength: number = circumference * percentage;
            const strokeDashoffset: number = circumference - strokeLength;
            const currentRotation: number = accumulatedAngle;

            accumulatedAngle += percentage * 360;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transformOrigin: "50px 50px",
                  transform: `rotate(${currentRotation}deg)`,
                  strokeLinecap: data.length === 1 ? "round" : "butt",
                  transition:
                    "stroke-dashoffset 0.6s ease-in-out, transform 0.6s ease-in-out",
                }}
              />
            );
          })}
      </svg>
    </div>
  );
};

export default DonutChart;
