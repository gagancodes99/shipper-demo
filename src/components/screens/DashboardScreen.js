import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Clock, CheckCircle, Truck ,ArrowLeft } from 'lucide-react';

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
  const onBack = () => {
    navigate(-1); // -1 goes back one page in history
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
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto">
      {/* Status Bar */}
      {/* <div className="flex items-center justify-between px-4 py-2 bg-white text-black text-sm">
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
      </div> */}

      {/* Header */}
     <div className="flex items-center justify-between px-4 py-4">
  <button 
    onClick={onBack} 
    className="flex items-center gap-2"
  >
    <ArrowLeft className="w-5 h-5 text-gray-700" />
    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
  </button>
  <div className="relative">
    <button className="p-1">
      <Bell className="w-6 h-6 text-gray-700" />
    </button>
  </div>
</div>

      <div className="px-4 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Active Card */}
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">3</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          
          {/* Scheduled Card */}
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">2</div>
            <div className="text-sm text-gray-500">Scheduled</div>
          </div>
          
          {/* Completed Card */}
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900">12</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>

        {/* Rest of your component remains the same */}
        {/* Post New Job Button */}
        <button
          onClick={handleNewJob}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl font-normal">+</span>
          <span>Post New Job</span>
        </button>

        {/* Recent Jobs */}
      <div className="bg-white p-3">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-semibold text-gray-900">Recent Jobs</h2>
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
          <span className="text-blue-600 font-medium text-sm">Active</span>
        </div>
        {/* Track moved to the time row below */}
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

        {/* Times + Track aligned on same row */}
        <div className="mt-2 ml-5 flex items-center justify-between">
          <div className="text-gray-500 text-xs flex gap-6">
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-700">Start time</span>
              <span>9:30 AM</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-700">End time</span>
              <span>2:30 PM</span>
            </div>
          </div>
          <button
            onClick={() => handleTrackJob('#1001')}
            className="text-blue-600 font-medium text-sm"
          >
            Track
          </button>
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
        {/* Track moved to the time row below */}
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

        {/* Times + Track aligned on same row */}
        <div className="mt-2 ml-5 flex items-center justify-between">
          <div className="text-gray-500 text-xs flex gap-6">
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-700">Start time</span>
              <span>2:30 PM</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-700">End time</span>
              <span>5:00 PM</span>
            </div>
          </div>
          <button
            onClick={() => handleTrackJob('#1003')}
            className="text-blue-600 font-medium text-sm"
          >
            Track
          </button>
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
        {/* Track moved to the time row below */}
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

        {/* Times + Track aligned on same row */}
        <div className="mt-2 ml-5 flex items-center justify-between">
          <div className="text-gray-500 text-xs flex gap-6">
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-700">Start time</span>
              <span>8:00 AM</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-700">End time</span>
              <span>11:45 AM</span>
            </div>
          </div>
          <button
            onClick={() => handleTrackJob('#1056')}
            className="text-blue-600 font-medium text-sm"
          >
            Track
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Featured Services */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Featured Services</h2>
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