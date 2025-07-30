import React from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="mb-8 flex flex-col items-center">
          {/* Phoenix Prime Logo */}
          <div className="mb-6">
            <svg width="120" height="60" viewBox="0 0 200 100" className="mb-4">
              {/* Orange arrow part */}
              <path d="M20 30 L80 30 L100 50 L80 70 L20 70 L40 50 Z" fill="#FF6B35"/>
              <path d="M30 40 L70 40 L80 50 L70 60 L30 60 L40 50 Z" fill="#FF6B35"/>
              <path d="M40 45 L65 45 L70 50 L65 55 L40 55 L45 50 Z" fill="#FF6B35"/>
              {/* Dark blue arrow part */}
              <path d="M90 30 L150 30 L170 50 L150 70 L90 70 L110 50 Z" fill="#2C3E50"/>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Phoenix Prime</h1>
          <p className="text-gray-500 text-lg">Driven to Deliver</p>
        </div>

        {/* Get Started Button */}
        <div className="w-full mb-8">
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            Get Started
            <span className="ml-2">→</span>
          </button>
        </div>

        {/* Features */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm">
            Reliable • Fast • Secure
          </p>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
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
          <p className="text-gray-400 text-xs">Version 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;