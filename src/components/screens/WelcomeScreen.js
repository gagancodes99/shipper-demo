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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="px-4 py-8 flex flex-col justify-center min-h-screen">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🚚</div>
          <h1 className="text-4xl font-bold mb-2">Phoenix Prime</h1>
          <p className="text-xl text-blue-100">Shipper</p>
          <p className="text-blue-100 mt-4 text-lg">
            Your trusted logistics partner
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-3xl">{feature.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Get Started
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-white/20 text-white py-4 px-6 rounded-lg font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-colors"
          >
            I Already Have an Account
          </button>
        </div>

        {/* Terms */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-xs">
            By continuing, you agree to our{' '}
            <button className="underline">Terms of Service</button>
            {' '}and{' '}
            <button className="underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;