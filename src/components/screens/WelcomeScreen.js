import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShipperLogo from '../../assets/shipperlogo.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <div className="flex-1 flex flex-col justify-center items-center px-0 py-8 w-full">
        {/* Logo */}
        <div className="mb-4 flex flex-col items-center w-full">
          <div className="mb-2">
            <div className="w-29 h-20 animate-float">
              <img
                src={ShipperLogo}
                alt="Phoenix Prime Logo"
                className="w-full h-full drop-shadow-lg object-contain"
              />
            </div>
          </div>

          {/* Full-bleed giant title */}
          <h1
            className="font-extrabold text-center leading-tight w-full"
            style={{
              fontSize: 'clamp(3rem, 12vw, 8rem)', // scales with viewport, caps to avoid ridiculous sizes
              margin: 0,
            }}
          >
            Phoenix Prime
          </h1>
          <p className="text-gray-500 font-semibold mt-1">Driven to Deliver</p>
        </div>

        {/* Get Started Button */}
        <div className="w-full max-w-xl mb-8 px-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-black text-white py-4 text-xl rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            Get Started <span className="ml-2">→</span>
          </button>
        </div>

        {/* Tagline */}
        <div className="text-center mb-6 px-4">
          <p className="text-gray-600 text-lg">Reliable • Fast • Secure</p>
        </div>

        {/* Sign in */}
        <div className="text-center">
          <p className="text-gray-600 text-base">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Version */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">Version 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
