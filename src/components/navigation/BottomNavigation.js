import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * BottomNavigation - Mobile-first bottom tab navigation component
 * 
 * Features:
 * - 4-tab navigation: Dashboard, Jobs, Transactions, Profile
 * - Active state indicators with gradient styling
 * - Mobile-optimized touch targets (minimum 44px)
 * - SVG icons for each tab
 * - Badge support for notifications/counts
 * - Accessibility support with proper ARIA labels
 */

const BottomNavigation = ({ badges = {} }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      badge: badges.dashboard
    },
    {
      id: 'jobs',
      path: '/jobs',
      label: 'Jobs',
      icon: JobsIcon,
      badge: badges.jobs
    },
    {
      id: 'transactions',
      path: '/transactions',
      label: 'Transactions',
      icon: TransactionsIcon,
      badge: badges.transactions
    },
    {
      id: 'profile',
      path: '/profile',
      label: 'Profile',
      icon: ProfileIcon,
      badge: badges.profile
    }
  ];

  const handleTabPress = (path) => {
    navigate(path);
  };

  const isActiveTab = (path) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab.path);
          const IconComponent = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.path)}
              className={`flex-1 py-2 px-1 min-h-[60px] flex flex-col items-center justify-center relative transition-colors duration-200 ${
                isActive 
                  ? 'text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={`Navigate to ${tab.label}`}
              role="tab"
              aria-selected={isActive}
            >
              {/* Tab Icon */}
              <div className="relative mb-1">
                <IconComponent 
                  className={`w-6 h-6 ${
                    isActive 
                      ? 'text-blue-500' 
                      : 'text-gray-500'
                  }`}
                />
                
                {/* Badge */}
                {tab.badge && tab.badge > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </div>
                )}
              </div>
              
              {/* Tab Label */}
              <span className={`text-xs font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' 
                  : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * SVG Icon Components
 */

const DashboardIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const JobsIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6h-2.5l-1.1-1.4c-.3-.4-.7-.6-1.2-.6H8.8c-.5 0-.9.2-1.2.6L6.5 6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM8 15l2.5-3.21 1.79 2.15 2.5-3.22L17 15H8z"/>
  </svg>
);

const TransactionsIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

const ProfileIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export default BottomNavigation;