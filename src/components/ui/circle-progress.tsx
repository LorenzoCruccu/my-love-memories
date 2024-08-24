import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircleProgressProps {
  progress: number;
  level: number;
  voteCount: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  progress,
  level,
  voteCount,
}) => {
  const maxVotes = level === 1 ? 10 : level === 2 ? 50 : 100;

  return (
    <div className="p-4 text-center">
      <div className="flex flex-col items-center">
        <div className="h-24 w-24">
          <CircularProgressbarWithChildren
            value={progress}
            styles={buildStyles({
              // Path and text color
              pathColor: `#7A1CAC`,
              textColor: "#7A1CAC",
              trailColor: "#d6d6d6",
            })}
          >
            <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
              Level {level}
            </div>
            <div style={{ fontSize: 12, color: "#555" }}>
              {voteCount}/{maxVotes} votes
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </div>
  );
};

export default CircleProgress;
