import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * JobsScreen - Job management and tracking interface
 * 
 * Features:
 * - List of all user jobs with filtering
 * - Job status tracking and updates
 * - Search and filter functionality
 * - Job details modal/navigation
 * - Mobile-optimized job cards
 */

const JobsScreen = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock jobs data
  const allJobs = [
    {
      id: 'PPS001',
      type: 'Single Pickup',
      status: 'In Transit',
      statusColor: 'bg-blue-100 text-blue-600',
      pickup: 'Sydney CBD, NSW',
      delivery: 'Parramatta, NSW',
      date: '2025-01-29',
      time: '10:30 AM',
      value: '$85.00',
      items: '2 Boxes, 1 Pallet'
    },
    {
      id: 'PPS002',
      type: 'Multi-Drop',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-600',
      pickup: 'Melbourne CBD, VIC',
      delivery: 'Richmond, VIC + 2 more',
      date: '2025-01-28',
      time: '2:15 PM',
      value: '$145.00',
      items: '5 Boxes'
    },
    {
      id: 'PPS003',
      type: 'Multi-Pickup',
      status: 'Pending',
      statusColor: 'bg-orange-100 text-orange-600',
      pickup: 'Brisbane CBD, QLD + 2 more',
      delivery: 'Gold Coast, QLD',
      date: '2025-01-30',
      time: '9:00 AM',
      value: '$220.00',
      items: '3 Pallets, 8 Boxes'
    },
    {
      id: 'PPS004',
      type: 'Single Pickup',
      status: 'Cancelled',
      statusColor: 'bg-red-100 text-red-600',
      pickup: 'Perth CBD, WA',
      delivery: 'Fremantle, WA',
      date: '2025-01-27',
      time: '11:45 AM',
      value: '$75.00',
      items: '1 Box'
    },
    {
      id: 'PPS005',
      type: 'Single Pickup',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-600',
      pickup: 'Adelaide CBD, SA',
      delivery: 'Glenelg, SA',
      date: '2025-01-26',
      time: '3:30 PM',
      value: '$95.00',
      items: '4 Boxes, 2 Bags'
    }
  ];

  const filters = [
    { key: 'all', label: 'All Jobs' },
    { key: 'pending', label: 'Pending' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  const filteredJobs = allJobs.filter(job => {
    const matchesFilter = activeFilter === 'all' || 
      job.status.toLowerCase().replace(' ', '_') === activeFilter;
    const matchesSearch = job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.delivery.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleJobPress = (jobId) => {
    // Navigate to job details or open modal
    console.log('Navigate to job:', jobId);
  };

  const handleNewBooking = () => {
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Jobs</h1>
            <p className="text-blue-100 mt-1">
              Track and manage your shipments
            </p>
          </div>
          <button
            onClick={handleNewBooking}
            className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
          >
            + New Job
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs by ID, pickup, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-3">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Jobs Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search criteria' 
                  : activeFilter === 'all' 
                    ? 'You haven\'t created any jobs yet' 
                    : `No ${activeFilter.replace('_', ' ')} jobs found`
                }
              </p>
              {activeFilter === 'all' && !searchQuery && (
                <button
                  onClick={handleNewBooking}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Create Your First Job
                </button>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobPress(job.id)}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Job Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-800">#{job.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{job.value}</p>
                    <p className="text-xs text-gray-500">{job.date}</p>
                  </div>
                </div>

                {/* Job Type */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {job.type}
                  </span>
                </div>

                {/* Pickup & Delivery */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 text-sm mt-1">📍</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Pickup</p>
                      <p className="text-sm font-medium text-gray-800">{job.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-red-500 text-sm mt-1">📍</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Delivery</p>
                      <p className="text-sm font-medium text-gray-800">{job.delivery}</p>
                    </div>
                  </div>
                </div>

                {/* Items & Time */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>📦 {job.items}</span>
                  <span>🕐 {job.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsScreen;