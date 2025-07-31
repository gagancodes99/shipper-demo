import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShipperLogo from '../../assets/shipperlogo.png'
/**
 * WelcomeScreen - App welcome and onboarding screen
 * 
 * Features:
 * - App introduction and branding
 * - Navigation to login or registration
 * - Feature highlights
 * - Mobile-first design with gradient styling
 */

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📦',
      title: 'Easy Booking',
      description: 'Book your shipments in just a few taps'
    },
    {
      icon: '🚚',
      title: 'Real-time Tracking',
      description: 'Track your packages every step of the way'
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Safe and secure payment processing'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto">
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-sm mx-auto w-full">
        {/* Logo */}
       <div className="mb-8 flex flex-col items-center w-full">
  {/* Phoenix Prime Logo */}
  <div className="mb-6">
    <div className="w-200 h-200 mb-8 animate-float">
      <img 
        src={ShipperLogo} 
        alt="Phoenix Prime Logo" 
        className="w-full h-full drop-shadow-lg"
      />
    </div>
  </div>

  {/* Full-width title */}
  <h1 
    className="font-bold text-gray-900 mb-2 w-full text-center"
    style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)' }} // fluid sizing if desired
  >
    Phoenix Prime
  </h1>
  <p className="text-gray-500 text-2xl font-bold ">Driven to Deliver</p>
</div>


        {/* Get Started Button */}
        <div className="w-full mb-8">
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-black text-white py-4 text-2xl px-6 rounded-lg font-semibold  hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            Get Started
            <span className="ml-2">→</span>
          </button>
        </div>

        {/* Features */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-2xl">
            Reliable • Fast • Secure
          </p>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600 text-2xl">
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
          <p className="text-gray-400 text-2xl">Version 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;