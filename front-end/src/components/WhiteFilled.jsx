import React from 'react';
import '../style.css'; // seulement si tu veux appliquer une classe CSS


export const PlayerPlay = ({ className, color = "#205BF1" }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
};
export const WhiteFilled = ({

  size,
  icon,
  className,
  text = "Button Ttile",
}) => {
  return (
    <div className={`white-filled ${size} icon-${icon} ${className}`}>
      {icon && <PlayerPlay className="player-play" color="#205BF1" />}

      <div className="button-ttile">{text}</div>
    </div>
  );
};
