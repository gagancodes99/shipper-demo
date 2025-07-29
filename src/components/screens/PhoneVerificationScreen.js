import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PhoneVerificationScreen - Phone number verification screen
 * 
 * Features:
 * - 6-digit verification code input
 * - Automatic code input handling
 * - Resend code functionality with countdown
 * - Verification with backend
 * - Navigation after successful verification
 */

const PhoneVerificationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyPhone, isLoading } = useAuth();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Get phone number from navigation state
  const phoneNumber = location.state?.phone || '+1234567890';
  const fromRegistration = location.state?.fromRegistration || false;

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
    if (errors.code) {
      setErrors({});
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
    const result = await verifyPhone(phoneNumber, verificationCode);
    
    if (result.success) {
      // Navigate to dashboard after successful verification
      navigate('/dashboard', { replace: true });
    } else {
      setErrors({ code: result.error || 'Invalid verification code. Please try again.' });
      setCode(['', '', '', '', '', '']);
      // Focus first input
      const firstInput = document.getElementById('code-0');
      if (firstInput) firstInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setErrors({ code: 'Please enter the complete 6-digit code' });
      return;
    }
    
    handleVerification(verificationCode);
  };

  const handleResendCode = () => {
    if (!canResend) return;
    
    // Mock resend logic - replace with actual API call
    console.log('Resending verification code to:', phoneNumber);
    
    // Reset countdown
    setResendCountdown(60);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    setErrors({});
    
    // Focus first input
    const firstInput = document.getElementById('code-0');
    if (firstInput) firstInput.focus();
  };

  const maskPhoneNumber = (phone) => {
    // Mask middle digits of phone number for privacy
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, -7)}***${cleaned.slice(-4)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="px-4 py-8 flex flex-col justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Phone</h1>
          <p className="text-blue-100 mb-2">
            We've sent a 6-digit code to
          </p>
          <p className="text-white font-semibold text-lg">
            {maskPhoneNumber(phoneNumber)}
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errors.code && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">{errors.code}</p>
              </div>
            )}

            {/* Code Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-4 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.code ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 6}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Phone Number'
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm mb-2">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                onClick={handleResendCode}
                className="text-blue-600 font-semibold hover:text-blue-800"
                disabled={isLoading}
              >
                Resend Code
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend code in {resendCountdown}s
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Development Mode:</strong> Use code <span className="font-mono bg-blue-100 px-2 py-1 rounded">123456</span> to verify
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(fromRegistration ? '/register' : '/profile')}
            className="text-blue-200 text-sm hover:text-white"
            disabled={isLoading}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationScreen;