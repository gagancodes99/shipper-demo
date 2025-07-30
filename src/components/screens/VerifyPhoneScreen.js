import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * VerifyPhoneScreen - 6-digit verification code input screen
 * 
 * Features:
 * - 6-digit code input with auto-focus
 * - Resend code functionality with countdown
 * - Auto-submit when all digits are entered
 * - Help text and troubleshooting
 */

const VerifyPhoneScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState('');
  const [resendCountdown, setResendCountdown] = useState(27);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get phone number from navigation state
  const phoneNumber = location.state?.phoneNumber || '+91 444 444 4444';

  // Countdown timer for resend functionality
  useEffect(() => {
    if (resendCountdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
  }, [resendCountdown, canResend]);

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Clear errors when user starts typing
    if (errors) {
      setErrors('');
    }
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerification(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          const newCode = digits.split('');
          setCode(newCode);
          handleVerification(digits);
        }
      });
    }
  };

  const handleVerification = async (verificationCode) => {
    setIsLoading(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        // Navigate to dashboard after successful verification
        navigate('/dashboard', { replace: true });
      } else {
        setErrors('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        // Focus first input
        const firstInput = document.getElementById('code-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      setErrors('Verification failed. Please try again.');
      setCode(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    
    // Reset countdown
    setResendCountdown(27);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    setErrors('');
    
    // Focus first input
    const firstInput = document.getElementById('code-0');
    if (firstInput) firstInput.focus();
  };

  const handleChangePhoneNumber = () => {
    navigate('/phone-verification');
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
        <h1 className="text-lg font-semibold text-gray-900">Verify Phone</h1>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💬</span>
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Verification Code</h2>
            <p className="text-gray-600 text-sm mb-2">
              We've sent a 6-digit code to
            </p>
            <p className="text-gray-900 font-semibold">
              {phoneNumber}
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-8">
            <div className="flex justify-center space-x-3 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn't receive the code?{' '}
                {canResend ? (
                  <button
                    onClick={handleResendCode}
                    className="text-blue-600 font-semibold hover:text-blue-800"
                    disabled={isLoading}
                  >
                    Resend
                  </button>
                ) : (
                  <span className="text-blue-600 font-semibold">
                    Resend in {resendCountdown}s
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errors && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-600 text-sm text-center">{errors}</p>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Having trouble?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Check your SMS messages or wait a moment for the code to arrive. The code will expire in 10 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Change Phone Number Button */}
          <button
            onClick={handleChangePhoneNumber}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Change Phone Number
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center mt-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600 text-sm">Verifying...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPhoneScreen;