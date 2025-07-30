import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PhoneVerificationScreen - Phone number input screen
 * 
 * Features:
 * - Phone number input with country code
 * - SMS verification code sending
 * - Information about why phone verification is needed
 * - Terms acceptance for SMS messages
 */

const PhoneVerificationScreen = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate sending SMS code
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Navigate to verification code screen with phone number
      navigate('/verify-phone', { 
        state: { phoneNumber: `${countryCode} ${phoneNumber}` } 
      });
    } catch (error) {
      console.error('Failed to send verification code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Phone Verification</h1>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📞</span>
              </div>
              <div className="absolute -bottom-1 -right-1">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Your Phone Number</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We'll send you a 6-digit verification code to confirm your phone number
            </p>
          </div>

          {/* Phone Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex space-x-3">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="+91">IN +91</option>
                <option value="+1">US +1</option>
                <option value="+44">UK +44</option>
                <option value="+61">AU +61</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Why do we need this?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your phone number helps us verify your identity and send important updates about your deliveries and earnings.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Text */}
          <p className="text-xs text-gray-500 text-center mb-8 leading-relaxed">
            By continuing, you agree to receive SMS messages from Phoenix Prime. Message and data rates may apply.
          </p>

          {/* Send Verification Code Button */}
          <button
            onClick={handleSendCode}
            disabled={!phoneNumber.trim() || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              phoneNumber.trim() && !isLoading 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Sending Code...
              </div>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationScreen;