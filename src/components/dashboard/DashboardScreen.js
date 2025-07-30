import React from 'react';

/**
 * Comprehensive Dashboard Screen Component
 * Main landing screen with complete dashboard functionality including:
 * - Header with notifications
 * - Job statistics cards
 * - Main action button
 * - Recent jobs section
 * - Featured services
 * - Mobile-first responsive design with Tailwind CSS
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.onNavigate - Navigation callback function
 * @param {Function} props.onViewJobs - View all jobs callback
 * @param {Function} props.onPostJob - Post new job callback
 * @param {Function} props.onTrackJob - Track specific job callback
 * @param {Function} props.onViewNotifications - View notifications callback
 */
const DashboardScreen = ({ 
  onNavigate, 
  onViewJobs, 
  onPostJob, 
  onTrackJob,
  onViewNotifications
}) => {
  // Mock data for job statistics
  const jobStats = {
    active: 3,
    scheduled: 2,
    completed: 12
  };

  // Mock data for recent jobs
  const recentJobs = [
    {
      id: '1001',
      status: 'Active',
      statusColor: 'bg-orange-100 text-orange-800',
      dotColor: 'bg-orange-500',
      from: '123 George St, Sydney NSW',
      to: '456 Collins St, Melbourne VIC',
      fromTime: '5:30 AM',
      toTime: '2:30 PM',
      date: 'Today'
    },
    {
      id: '1002',
      status: 'Estimated',
      statusColor: 'bg-blue-100 text-blue-800',
      dotColor: 'bg-blue-500',
      from: '789 Queen St, Brisbane QLD',
      to: '321 King St, Adelaide SA',
      fromTime: '2:00 PM',
      toTime: '3:00 PM',
      date: 'Tomorrow'
    },
    {
      id: '0996',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-500',
      from: '654 Bourke St, Melbourne VIC',
      to: '987 Pitt St, Sydney NSW',
      fromTime: '8:00 AM',
      toTime: '11:45 AM',
      date: 'Yesterday'
    }
  ];

  const handlePostNewJob = () => {
    if (onPostJob) {
      onPostJob();
    } else if (onNavigate) {
      onNavigate('booking');
    }
  };

  const handleViewAllJobs = () => {
    if (onViewJobs) {
      onViewJobs();
    } else if (onNavigate) {
      onNavigate('jobs');
    }
  };

  const handleTrackJob = (jobId) => {
    if (onTrackJob) {
      onTrackJob(jobId);
    }
  };

  const handleViewNotifications = () => {
    if (onViewNotifications) {
      onViewNotifications();
    }
  };

  const handleExpressDelivery = () => {
    // Navigate to booking with express delivery preset
    if (onNavigate) {
      onNavigate('booking', { serviceType: 'express' });
    }
  };

  const truncateAddress = (address, maxLength = 30) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button 
              onClick={handleViewNotifications}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-3-12v7a1 1 0 001 1h7a1 1 0 001-1V5a1 1 0 00-1-1h-7a1 1 0 00-1 1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13h-6v6h6v-6z" />
              </svg>
              {/* Red notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Job Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{jobStats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{jobStats.scheduled}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{jobStats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* Main Action Button */}
        <button
          onClick={handlePostNewJob}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Post New Job</span>
        </button>

        {/* Recent Jobs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Jobs</h2>
              <button
                onClick={handleViewAllJobs}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {recentJobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`border-b border-gray-100 pb-4 ${
                    index === recentJobs.length - 1 ? 'border-b-0 pb-0' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-800">{job.id}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.statusColor}`}>
                        <div className={`w-2 h-2 rounded-full ${job.dotColor} mr-1.5`}></div>
                        {job.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleTrackJob(job.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Track
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 text-gray-500 font-medium">From:</div>
                      <div className="flex-1">
                        <div className="text-gray-800">{truncateAddress(job.from)}</div>
                        <div className="text-gray-600">{job.fromTime}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 text-gray-500 font-medium">To:</div>
                      <div className="flex-1">
                        <div className="text-gray-800">{truncateAddress(job.to)}</div>
                        <div className="text-gray-600">{job.toTime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Services Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Featured Services</h2>
            
            {/* Express Delivery Card */}
            <div 
              onClick={handleExpressDelivery}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Express Delivery</h3>
                  <p className="text-blue-100 mb-4 leading-relaxed">
                    Get packages delivered within 4 hours. Perfect for urgent delivery needs.
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-blue-100">4 hours delivery</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-blue-100">Real-time tracking</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                    🚛
                  </div>
                </div>
              </div>
              
              <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full">
                Try Express Delivery
              </button>
            </div>
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default DashboardScreen;