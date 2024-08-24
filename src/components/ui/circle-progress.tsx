import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CircleProgressProps {
  progress: number;
  level: number;
  voteCount: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ progress, level, voteCount }) => {
  return (
      <div className=" p-4 text-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24">
            <CircularProgressbar
              value={progress}
              text={`Level ${level}`}
              styles={buildStyles({
                pathColor: `#7A1CAC`,
                textColor: '#f88',
                trailColor: '#d6d6d6',
                backgroundColor: '#3e98c7',
              })}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {`${voteCount} / ${level === 1 ? 10 : level === 2 ? 50 : '+'} votes`}
          </p>
        </div>
      </div>
  );
};

export default CircleProgress;
