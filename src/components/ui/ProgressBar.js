import React from 'react';

/**
 * ProgressBar component displays a visual progress indicator for multi-step processes
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentStep - Current active step (1-based index)
 * @param {number} props.totalSteps - Total number of steps in the process
 * @param {string[]} props.stepNames - Array of step names for display
 * @returns {JSX.Element} Rendered progress bar component
 */
const ProgressBar = ({ currentStep, totalSteps, stepNames }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="bg-white p-4 shadow-sm border-b border-slate-200">
      <div className="mb-2">
        <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="font-medium text-blue-600">{stepNames[currentStep - 1]}</span>
      </div>
    </div>
  );
};

export { ProgressBar };
export default ProgressBar;