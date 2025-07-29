import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';

// Navigation Components
import ProtectedRoute, { PublicRoute } from './ProtectedRoute';
import BottomNavigation from './BottomNavigation';

// Authentication Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import PhoneVerificationScreen from '../screens/PhoneVerificationScreen';

// Main App Screens
import DashboardScreen from '../screens/DashboardScreen';
import JobsScreen from '../screens/JobsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Booking Flow (imported from existing App component)
import BookingFlow from '../BookingFlow';

/**
 * AppRouter - Main application router with authentication-based routing
 * 
 * Features:
 * - Public routes: Welcome, Login, Registration, Phone Verification
 * - Protected routes: Dashboard, Jobs, Transactions, Profile, Booking Flow
 * - Route guards and redirects based on authentication status
 * - Deep linking support for job tracking URLs
 * - Bottom navigation for authenticated users
 * - Context providers for global state management
 */

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes - Redirect authenticated users */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <WelcomeScreen />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegistrationScreen />
                </PublicRoute>
              } 
            />
            
            {/* Phone Verification - Accessible to both authenticated and unauthenticated users */}
            <Route path="/verify-phone" element={<PhoneVerificationScreen />} />
            
            {/* Protected Routes - Require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainAppLayout>
                    <DashboardScreen />
                  </MainAppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute>
                  <MainAppLayout>
                    <JobsScreen />
                  </MainAppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute>
                  <MainAppLayout>
                    <TransactionsScreen />
                  </MainAppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <MainAppLayout>
                    <ProfileScreen />
                  </MainAppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Booking Flow - Protected route without bottom navigation */}
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <BookingFlow />
                </ProtectedRoute>
              } 
            />
            
            {/* Job Tracking - Public route for package tracking */}
            <Route 
              path="/track/:jobId" 
              element={<JobTrackingScreen />} 
            />
            
            {/* Catch-all route - Redirect based on authentication */}
            <Route 
              path="*" 
              element={<Navigate to="/dashboard" replace />} 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

/**
 * MainAppLayout - Layout wrapper for main app screens with bottom navigation
 */
const MainAppLayout = ({ children }) => {
  // Mock badge counts - replace with actual data from context/API
  const badges = {
    dashboard: 0,
    jobs: 2,
    transactions: 0,
    profile: 0
  };

  return (
    <div className="relative">
      {children}
      <BottomNavigation badges={badges} />
    </div>
  );
};

/**
 * JobTrackingScreen - Public job tracking interface
 * Allows customers to track packages without authentication
 */
const JobTrackingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Your Package</h1>
        <p className="text-gray-600 mb-6">
          Enter your tracking ID to see real-time updates
        </p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter tracking ID (e.g., PPS001)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
            Track Package
          </button>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <button className="text-blue-500 hover:text-blue-700">Contact Support</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppRouter;