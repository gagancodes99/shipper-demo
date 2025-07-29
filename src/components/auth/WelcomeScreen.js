import React from 'react';

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Phoenix Prime Logo */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {/* Logo SVG - simplified version of Phoenix Prime logo */}
          <div className="w-24 h-24 mb-6">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <path 
                d="M20 15 L45 15 L40 25 L20 25 Z" 
                fill="#FF6B35"
              />
              <path 
                d="M20 25 L40 25 L35 35 L20 35 Z" 
                fill="#FF6B35"
              />
              <path 
                d="M20 35 L35 35 L30 45 L20 45 Z" 
                fill="#FF6B35"
              />
              <path 
                d="M45 15 L70 30 L45 45 L50 30 Z" 
                fill="#1E3A8A"
              />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Phoenix Prime</h1>
          <p className="text-lg text-gray-600 mb-8">Driven to Deliver</p>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={onGetStarted}
          className="w-full bg-black text-white font-semibold py-4 px-8 rounded-xl hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>Get Started</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom Text */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm mb-2">Reliable • Fast • Secure</p>
        <p className="text-gray-400 text-xs">Version 1.0</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;