import React from "react";

const burstItems = Array.from({ length: 46 }, (_, index) => index);
const ribbonItems = Array.from({ length: 28 }, (_, index) => index);

export default function Celebration({ active }) {
  if (!active) {
    return null;
  }

  return (
    <div className="celebration" aria-hidden="true">
      <div className="celebration-glow" />
      {burstItems.map((item) => (
        <span
          className="celebration-spark"
          key={item}
          style={{
            "--angle": `${item * 15}deg`,
            "--distance": `${96 + (item % 8) * 18}px`,
            "--delay": `${(item % 10) * 0.035}s`
          }}
        />
      ))}
      {ribbonItems.map((item) => (
        <span
          className="celebration-confetti"
          key={`ribbon-${item}`}
          style={{
            "--left": `${4 + ((item * 11) % 92)}%`,
            "--delay": `${(item % 9) * 0.08}s`,
            "--sway": `${item % 2 === 0 ? -1 : 1}`,
            "--spin": `${180 + (item % 6) * 45}deg`
          }}
        />
      ))}
      <span className="celebration-star celebration-star-one">★</span>
      <span className="celebration-star celebration-star-two">✦</span>
      <span className="celebration-star celebration-star-three">★</span>
      <span className="celebration-star celebration-star-four">✦</span>
    </div>
  );
}
