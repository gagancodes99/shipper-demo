import React, { useState, useEffect, useRef } from 'react';

const VerificationCodeScreen = ({ onVerifyCode, onBack, onChangeNumber, phoneNumber }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(27);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer for resend
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

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Clear any errors
    if (errors.code) {
      setErrors(prev => ({ ...prev, code: '' }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      // Focus the last input
      inputRefs.current[5]?.focus();
      // Auto-verify pasted code
      handleVerifyCode(pastedData);
    }
  };

  const handleVerifyCode = (codeString = code.join('')) => {
    if (codeString.length !== 6) {
      setErrors({ code: 'Please enter the complete 6-digit code' });
      return;
    }

    onVerifyCode(codeString);
  };

  const handleResendCode = () => {
    if (canResend) {
      setResendTimer(27);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      setErrors({});
      // Focus first input
      inputRefs.current[0]?.focus();
      // Here you would call the resend API
      console.log('Resending verification code...');
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Assume format is +91XXXXXXXXXX
    const countryCode = phone.slice(0, 3);
    const number = phone.slice(3);
    return `${countryCode} ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex items-center">
          <button onClick={onBack} className="mr-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Verify Phone</h1>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Message Icon with Check Mark */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {/* Blue check mark */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Enter Verification Code</h1>
            <p className="text-gray-600 leading-relaxed">
              We've sent a 6-digit code to{' '}
              <span className="font-medium text-gray-900">
                {formatPhoneNumber(phoneNumber)}
              </span>
            </p>
          </div>

          {/* Verification Code Input */}
          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.code ? 'border-red-300' : 'border-gray-300'
                  } ${digit ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                />
              ))}
            </div>
            {errors.code && (
              <p className="text-center text-sm text-red-600">{errors.code}</p>
            )}
          </div>

          {/* Resend Code */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-2">
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Resend
                </button>
              ) : (
                <span className="text-gray-500">
                  Resend in {resendTimer}s
                </span>
              )}
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-orange-800 mb-1">Having trouble?</h3>
                <p className="text-sm text-orange-700">
                  SMS may take up to 2 minutes to arrive. The code expires in 10 minutes. 
                  Check your spam folder or try resending.
                </p>
              </div>
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerifyCode()}
            disabled={!isCodeComplete}
            className={`w-full font-semibold py-4 px-4 rounded-lg transition-colors mb-4 ${
              isCodeComplete
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Verify Code
          </button>

          {/* Change Phone Number */}
          <div className="text-center">
            <button
              onClick={onChangeNumber}
              className="text-blue-600 font-medium hover:text-blue-700 text-sm"
            >
              Change Phone Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeScreen;