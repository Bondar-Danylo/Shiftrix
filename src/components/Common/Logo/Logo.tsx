import { useState, useEffect, memo } from "react";
import type { ClockHandProps, LogoProps } from "./Logo.types";

const ClockHand = memo(({ angle, length, width, color }: ClockHandProps) => (
  <line
    x1="50"
    y1="50"
    x2="50"
    y2={50 - length}
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    style={{
      transformOrigin: "50% 50%",
      transform: `rotate(${angle}deg)`,
      transition: "transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)",
    }}
  />
));

const Logo = ({ size = 100, color = "#113797" }: LogoProps) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer: number = setInterval((): void => setTime(new Date()), 1000);
    return (): void => clearInterval(timer);
  }, []);

  const s: number = time.getSeconds();
  const m: number = time.getMinutes();
  const h: number = time.getHours();

  const angles = {
    hour: (h % 12) * 30 + m * 0.5,
    minute: m * 6 + s * 0.1,
  };

  return (
    <div style={{ width: size, height: size, display: "inline-block" }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Hexagon */}
        <path
          d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z"
          stroke={color}
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Clock */}
        <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="3" />

        {/* Hour Arrow*/}
        <ClockHand angle={angles.hour} length={15} width={3} color={color} />

        {/* Minute Arrow */}
        <ClockHand angle={angles.minute} length={22} width={2} color={color} />

        {/* Center */}
        <circle cx="50" cy="50" r="1.8" fill={color} />
      </svg>
    </div>
  );
};

export default Logo;
