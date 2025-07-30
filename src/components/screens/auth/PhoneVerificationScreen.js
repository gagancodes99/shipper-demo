import React, { useState, useEffect, useRef } from 'react';
import Header from '../../ui/Header';

/**
 * PhoneVerificationScreen component - OTP verification interface
 * 
 * Provides a 6-digit OTP input interface with auto-focus navigation,
 * resend functionality, and timer. Designed to match Phoenix Prime Shipper's
 * mobile-first design patterns and gradient theme.
 * 
 * @param {Object} props - Component props
 * @param {string} props.phoneNumber - Phone number where OTP was sent
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {Function} props.onVerify - Callback when OTP verification is attempted
 * @param {Function} props.onResendOTP - Callback when resend OTP is requested
 * @param {boolean} [props.isLoading=false] - Loading state for verification
 * @param {string} [props.error] - Error message to display
 * @returns {JSX.Element} Rendered phone verification screen component
 */
const PhoneVerificationScreen = ({ 
  phoneNumber, 
  onBack, 
  onVerify, 
  onResendOTP, 
  isLoading = false,
  error 
}) => {
  // OTP input state - array of 6 digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Resend timer state
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Refs for input fields to manage focus
  const inputRefs = useRef([]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Start resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  /**
   * Handle OTP digit input with auto-navigation
   * 
   * @param {number} index - Index of the input field (0-5)
   * @param {string} value - New value entered
   */
  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit if multiple entered
    setOtp(newOtp);

    // Auto-focus next input if digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  /**
   * Handle backspace key press for navigation
   * 
   * @param {number} index - Index of the input field
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      // If current field is empty, move to previous field
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle paste event for OTP input
   * 
   * @param {ClipboardEvent} e - Paste event
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty field or the last field
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      // Auto-verify if 6 digits pasted
      if (pastedData.length === 6) {
        handleVerifyOtp(pastedData);
      }
    }
  };

  /**
   * Handle OTP verification
   * 
   * @param {string} otpCode - 6-digit OTP code to verify
   */
  const handleVerifyOtp = (otpCode = otp.join('')) => {
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  /**
   * Handle resend OTP request
   */
  const handleResendOtp = async () => {
    if (!canResend) return;
    
    const success = await onResendOTP(phoneNumber);
    if (success) {
      // Reset timer and clear current OTP
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      inputRefs.current[0]?.focus();
    }
  };

  /**
   * Format timer display
   */
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-sm mx-auto">
      <Header title="Verify Phone Number" onBack={onBack} />
      
      <div className="p-6">
        {/* Verification info section */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Verification Code</h2>
              <p className="text-sm opacity-90">Enter the 6-digit code sent to</p>
              <p className="text-sm font-medium">{phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* OTP input section */}
        <div className="mb-8">
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl transition-all duration-200 ${
                  digit 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 bg-white hover:border-blue-300 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-200 focus:outline-none`}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Verify button */}
          <button
            onClick={() => handleVerifyOtp()}
            disabled={otp.join('').length !== 6 || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : 'Verify Code'}
          </button>
        </div>

        {/* Resend section */}
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-4">
            Didn't receive the code?
          </p>
          
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="text-blue-600 font-semibold hover:underline"
            >
              Resend Code
            </button>
          ) : (
            <div className="text-sm text-slate-500">
              <p>Resend code in {formatTimer(resendTimer)}</p>
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-3 mt-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 mb-1">Trouble receiving the code?</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Check your phone's message inbox</li>
                <li>• Ensure you have good network coverage</li>
                <li>• Try resending the code after the timer expires</li>
                <li>• Contact support if issues persist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PhoneVerificationScreen };
export default PhoneVerificationScreen;