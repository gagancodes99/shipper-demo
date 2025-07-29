import React from 'react';

/**
 * WelcomeScreen component - Initial screen for unauthenticated users
 * 
 * Provides a welcoming introduction to Phoenix Prime Shipper app with options
 * to either register (Get Started) or sign in for existing users. Uses the
 * same gradient theme and mobile-first design patterns as the main app.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onGetStarted - Callback when "Get Started" button is clicked
 * @param {Function} props.onSignIn - Callback when "Sign In" button is clicked
 * @returns {JSX.Element} Rendered welcome screen component
 */
const WelcomeScreen = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 p-4 text-white shadow-lg">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold tracking-wide">Phoenix Prime Shipper</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-8">
        {/* App logo and welcome section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {/* App logo placeholder - replace with actual logo */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Welcome to<br />Phoenix Prime
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-sm mx-auto">
            Your trusted partner for comprehensive shipping and logistics solutions
          </p>
        </div>

        {/* Features overview */}
        <div className="mb-12 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-lg mr-4 mt-1">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Professional Service</h3>
                <p className="text-sm text-slate-600">Reliable shipping with real-time tracking and professional documentation</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 rounded-lg mr-4 mt-1">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Fast & Efficient</h3>
                <p className="text-sm text-slate-600">Quick booking process with multiple pickup and delivery options</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-2 rounded-lg mr-4 mt-1">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Secure & Trusted</h3>
                <p className="text-sm text-slate-600">Your goods are protected with comprehensive tracking and insurance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <button
            onClick={onGetStarted}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
          >
            Get Started
          </button>

          <button
            onClick={onSignIn}
            className="w-full bg-white text-slate-700 py-4 px-6 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Sign In
          </button>
        </div>

        {/* Footer text */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            By continuing, you agree to our{' '}
            <button className="text-blue-600 hover:underline">Terms of Service</button>
            {' '}and{' '}
            <button className="text-blue-600 hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export { WelcomeScreen };
export default WelcomeScreen;