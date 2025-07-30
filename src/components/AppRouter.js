import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import screen components
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import JobsScreen from './screens/JobsScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import existing booking flow (will be refactored)
import BookingFlow from './BookingFlow';

/**
 * AppRouter - Main routing component for the application
 * 
 * Features:
 * - Route protection based on authentication
 * - Bottom navigation for main screens
 * - Integration with existing booking flow
 * - Proper navigation handling
 */

// Bottom Navigation Component
const BottomNavigation = ({ currentPath, onNavigate, onNewJob }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠', path: '/dashboard' },
    { id: 'jobs', label: 'Jobs', icon: '📋', path: '/jobs' },
    { id: 'new-job', label: 'New Job', icon: '➕', path: '/booking', isSpecial: true },
    { id: 'transactions', label: 'Payments', icon: '💳', path: '/transactions' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' }
  ];

  const handleNavClick = (item) => {
    if (item.id === 'new-job') {
      onNewJob();
    } else {
      onNavigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
                          (item.id === 'new-job' && currentPath === '/booking');
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                item.isSpecial
                  ? 'bg-blue-600 text-white shadow-lg'
                  : isActive
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  
  return children;
};

// Main App Content (after authentication)
const MainApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  const handleNewJob = () => {
    setShowBookingFlow(true);
    navigate('/booking');
  };

  const handleBookingComplete = () => {
    setShowBookingFlow(false);
    navigate('/jobs');
  };

  const handleBookingCancel = () => {
    setShowBookingFlow(false);
    navigate('/dashboard');
  };

  // If we're in the booking flow, show it without bottom navigation
  if (location.pathname === '/booking' || showBookingFlow) {
    return (
      <BookingFlow 
        onComplete={handleBookingComplete}
        onCancel={handleBookingCancel}
      />
    );
  }

  return (
    <div className="pb-20"> {/* Add padding for bottom navigation */}
      <Routes>
        <Route 
          path="/dashboard" 
          element={<DashboardScreen onNewJob={handleNewJob} />} 
        />
        <Route 
          path="/jobs" 
          element={<JobsScreen onNewJob={handleNewJob} />} 
        />
        <Route 
          path="/transactions" 
          element={<TransactionsScreen />} 
        />
        <Route 
          path="/profile" 
          element={<ProfileScreen />} 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      <BottomNavigation 
        currentPath={location.pathname}
        onNavigate={navigate}
        onNewJob={handleNewJob}
      />
    </div>
  );
};

// Authentication Routes Component
const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};

// Main Router Component
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen">
        {isAuthenticated ? (
          <Routes>
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            } />
            
            {/* Redirect authenticated users away from auth pages */}
            <Route path="/welcome" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        ) : (
          <AuthRoutes />
        )}
      </div>
    </Router>
  );
};

export default AppRouter;