import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * DashboardScreen - Main dashboard with quick actions and overview
 * 
 * Features:
 * - Welcome message with user name
 * - Quick action buttons for new bookings
 * - Recent jobs overview
 * - Statistics cards
 * - Mobile-optimized layout with gradient styling
 */

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNewBooking = () => {
    navigate('/booking');
  };

  const handleViewJobs = () => {
    navigate('/jobs');
  };

  const handleViewTransactions = () => {
    navigate('/transactions');
  };

  // Mock statistics data
  const stats = [
    {
      label: 'Active Jobs',
      value: '3',
      icon: '📦',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Completed',
      value: '24',
      icon: '✅',
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'This Month',
      value: '$2,450',
      icon: '💰',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Pending',
      value: '2',
      icon: '⏳',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  // Mock recent jobs data
  const recentJobs = [
    {
      id: 'PPS001',
      type: 'Single Pickup',
      status: 'In Transit',
      destination: 'Sydney, NSW',
      date: '2025-01-29',
      statusColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'PPS002',
      type: 'Multi-Drop',
      status: 'Delivered',
      destination: 'Melbourne, VIC',
      date: '2025-01-28',
      statusColor: 'bg-green-100 text-green-600'
    },
    {
      id: 'PPS003',
      type: 'Multi-Pickup',
      status: 'Pending',
      destination: 'Brisbane, QLD',
      date: '2025-01-30',
      statusColor: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-blue-100 mt-1">
              Ready to ship something today?
            </p>
          </div>
          <div className="text-4xl">
            🚚
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={handleNewBooking}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              📦 New Booking
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleViewJobs}
                className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                📋 View Jobs
              </button>
              <button
                onClick={handleViewTransactions}
                className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                💳 Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Jobs</h2>
            <button
              onClick={handleViewJobs}
              className="text-blue-500 font-medium text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-800">#{job.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{job.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{job.type}</p>
                <p className="text-sm font-medium text-gray-800">📍 {job.destination}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-gray-800">Need Help?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get instant support or track your shipments with our help center.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white text-gray-700 py-2 px-4 rounded-lg font-medium shadow-sm">
              📞 Contact Support
            </button>
            <button className="bg-white text-gray-700 py-2 px-4 rounded-lg font-medium shadow-sm">
              📱 Track Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;