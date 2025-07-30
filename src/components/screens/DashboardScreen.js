import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * DashboardScreen - Main dashboard matching exact design specifications
 * 
 * Features:
 * - Clean mobile-first design with white background
 * - Status bar with signal bars and battery
 * - Header with Dashboard title and notification bell
 * - Three colored stat cards (Active, Scheduled, Completed)
 * - Post New Job button with plus icon
 * - Recent Jobs list with green/red status dots and Track buttons
 * - Featured Services section with Express Delivery card
 */

const DashboardScreen = ({ onNewJob }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNewJob = () => {
    if (onNewJob) {
      onNewJob();
    } else {
      navigate('/booking');
    }
  };

  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  const handleTrackJob = (jobId) => {
    navigate(`/job/${jobId}/tracking`);
  };

  const handleJobDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white text-black text-sm">
        <span className="font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
          </div>
          <div className="w-6 h-3 border border-black rounded-sm relative">
            <div className="w-4 h-1 bg-black rounded-full absolute top-1 left-1"></div>
            <div className="w-1 h-1 bg-black rounded-full absolute top-1 -right-0.5"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="relative">
          <button className="p-1">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 6H4l5-5v5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-600 rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="text-sm">Active</div>
          </div>
          <div className="bg-orange-500 rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold mb-1">2</div>
            <div className="text-sm">Scheduled</div>
          </div>
          <div className="bg-green-500 rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold mb-1">12</div>
            <div className="text-sm">Completed</div>
          </div>
        </div>

        {/* Post New Job Button */}
        <button
          onClick={handleNewJob}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl font-normal">+</span>
          <span>Post New Job</span>
        </button>

        {/* Recent Jobs */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <button
              onClick={handleViewAllJobs}
              className="text-blue-600 font-medium text-sm"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Job #1001 - Active */}
            <div className="bg-white border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">#1001</span>
                  <span className="text-green-600 font-medium text-sm">Active</span>
                </div>
                <button
                  onClick={() => handleTrackJob('#1001')}
                  className="text-blue-600 font-medium text-sm"
                >
                  Track
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <div className="text-gray-500 text-xs">From</div>
                    <div className="text-gray-900 font-medium">Unit 8 S, Downtown</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <div className="text-gray-500 text-xs">To</div>
                    <div className="text-gray-900 font-medium">84 Customer Ave, Uptown</div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs mt-2 ml-5">
                  9:30 AM - 2:30 PM
                </div>
              </div>
            </div>

            {/* Job #1003 - Itemized */}
            <div className="bg-white border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">#1003</span>
                  <span className="text-orange-600 font-medium text-sm">Itemized</span>
                </div>
                <button
                  onClick={() => handleTrackJob('#1003')}
                  className="text-blue-600 font-medium text-sm"
                >
                  Track
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <div className="text-gray-500 text-xs">From</div>
                    <div className="text-gray-900 font-medium">84 Laurel Ave, Industrial</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <div className="text-gray-500 text-xs">To</div>
                    <div className="text-gray-900 font-medium">84 Robert Plaza, Central</div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs mt-2 ml-5">
                  2:30 PM - 5:00 PM
                </div>
              </div>
            </div>

            {/* Job #1056 - Completed */}
            <div className="bg-white pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">#1056</span>
                  <span className="text-green-600 font-medium text-sm">Completed</span>
                </div>
                <button
                  onClick={() => handleTrackJob('#1056')}
                  className="text-blue-600 font-medium text-sm"
                >
                  Track
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <div className="text-gray-500 text-xs">From</div>
                    <div className="text-gray-900 font-medium">84 Maple Ave, Riverside</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <div className="text-gray-500 text-xs">To</div>
                    <div className="text-gray-900 font-medium">5 Main Street, Eastside</div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs mt-2 ml-5">
                  8:00 AM - 11:45 AM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Services */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Featured Services</h2>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2">Express Delivery</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Get packages delivered within 4 hours. Perfect for urgent shipments.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-blue-100 mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>4 hours delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>Real-time tracking</span>
                </div>
              </div>
              
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
                Try Express Delivery
              </button>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mb-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;