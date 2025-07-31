import React from 'react';
import ShipperLogo from '../../assets/shipperlogo.png'; // Adjust the path if needed

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-100 rounded-full opacity-20 blur-xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Phoenix Prime Logo */}
        <div className="mb-10 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-center">
            {/* Replaced with imported SVG */}
            <div className="w-280 h-280 mb-8 animate-float">
              <img 
                src={ShipperLogo} 
                alt="Phoenix Prime Logo" 
                className="w-full h-full drop-shadow-lg"
              />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500">
              Phoenix Prime
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-medium">Driven to Deliver</p>
          </div>
        </div>

        {/* Rest of your component remains the same */}
        <div className="w-full mb-16">
          <button
            onClick={onGetStarted}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-5 px-8 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center space-x-3 group"
          >
            <span className="tracking-wide">Get Started</span>
            <svg 
              className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-auto text-center">
          <div className="flex justify-center space-x-6 mb-4">
            {['Reliable', 'Fast', 'Secure'].map((item) => (
              <div key={item} className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 font-medium">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">Version 1.0</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;