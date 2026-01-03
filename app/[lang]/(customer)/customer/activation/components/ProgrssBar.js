import React from "react";

const ProgressBar = ({ progress, className }) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    clampedProgress > 0 && (
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 ${className}`}
      >
        <div
          className="bg-blue-600 dark:bg-blue-900 h-4 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center"
          style={{ width: `${clampedProgress}%` }}
        >
          <span className="text-xs font-medium text-white dark:text-gray-400 leading-none">
            {clampedProgress.toFixed(0)}%
          </span>
        </div>
      </div>
    )
  );
};

export default ProgressBar;
