import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  ClipboardList,
  CreditCard,
  BarChart2,
  User
} from 'lucide-react';

// Import screen components
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import JobsScreen from './screens/JobsScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobTrackingScreen from './screens/JobTrackingScreen';

// Import existing booking flow (will be refactored)
import BookingFlow from './BookingFlow';

// Bottom Navigation Component
const BottomNavigation = ({ currentPath, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { id: 'jobs', label: 'Jobs', icon: <ClipboardList size={20} />, path: '/jobs' },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard size={20} />, path: '/transactions' },
    // { id: 'reporting', label: 'Reporting', icon: <BarChart2 size={20} />, path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-0 py-2 z-40 max-w-sm mx-auto ">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <span className={`mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {React.cloneElement(item.icon, {
                  className: isActive ? 'text-blue-600' : 'text-gray-500',
                  fill: isActive ? 'currentColor' : 'none'
                })}
              </span>
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

  if (location.pathname === '/booking' || showBookingFlow) {
    return (
      <BookingFlow 
        onComplete={handleBookingComplete}
        onCancel={handleBookingCancel}
      />
    );
  }

  return (
    <div className="pb-20">
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
          path="/job/:jobId/tracking" 
          element={<JobTrackingScreen />} 
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
            <Route path="/*" element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            } />
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