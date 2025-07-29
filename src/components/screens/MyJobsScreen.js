import React, { useState } from 'react';
import { useJobs } from '../../context/JobsContext';

/**
 * MyJobsScreen Component
 * Comprehensive jobs management screen with enhanced UI matching design specifications
 */
const MyJobsScreen = ({ onViewJobDetails, onTrackJob, onBack, onContactDriver }) => {
  const {
    filteredJobs,
    loading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    jobCounts
  } = useJobs();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [displayedJobs, setDisplayedJobs] = useState(10);

  // Tab configuration matching design
  const tabs = [
    { id: 'active', label: 'Active', count: 1 },
    { id: 'upcoming', label: 'Upcoming', count: 7 },
    { id: 'past', label: 'Past', count: 26 }
  ];

  // Sample job data matching design specifications
  const sampleJobs = [
    {
      id: '#PP1001',
      status: 'In Route',
      progress: 65,
      driver: {
        name: 'Mike Johnson',
        avatar: '/api/placeholder/40/40',
        phone: '+61 400 123 456'
      },
      serviceType: 'Sal 4/4 - Yard (Private)',
      pickup: {
        category: 'Electronic Devices',
        location: 'Downtown',
        address: '123 George St, Sydney NSW 2000',
        time: '3:30 AM'
      },
      destination: {
        location: 'Customer Ave, Uptown',
        address: '456 Martin Place, Sydney NSW 2000',
        time: '2:30 PM'
      },
      package: {
        icon: 'electronics',
        weight: '1.1 kgs'
      },
      eta: '35 min',
      canTrack: true
    },
    {
      id: '#PP1002',
      status: 'Loading',
      progress: 25,
      driver: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40',
        phone: '+61 400 987 654'
      },
      serviceType: 'Sal 4/4 - Warehouse',
      pickup: {
        category: 'Supply Center',
        location: 'Industrial Zone',
        address: '789 Industrial Rd, Blacktown NSW 2148',
        time: '11:00 AM'
      },
      destination: {
        location: 'Retail Shop, Mall District',
        address: '321 Pitt St Mall, Sydney NSW 2000',
        time: '3:00 PM'
      },
      package: {
        icon: 'delivery',
        weight: '2.5 kgs'
      },
      eta: '41 min',
      canTrack: true
    }
  ];

  // Handle search toggle
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  // Handle filter toggle
  const handleFilterToggle = () => {
    // Filter functionality can be implemented here
    console.log('Filter clicked');
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveFilter(tabId);
    setDisplayedJobs(10); // Reset displayed jobs when changing tabs
  };

  // Handle load more
  const handleLoadMore = () => {
    setDisplayedJobs(prev => prev + 10);
  };

  // Handle job actions
  const handleViewDetails = (job) => {
    onViewJobDetails?.(job);
  };

  const handleTrackJob = (job) => {
    onTrackJob?.(job);
  };

  const handleContactDriver = (driver, type) => {
    if (type === 'call') {
      window.location.href = `tel:${driver.phone}`;
    } else if (type === 'message') {
      // Handle messaging functionality
      onContactDriver?.(driver, 'message');
    }
  };

  // Enhanced Job Card Component matching design specifications
  const EnhancedJobCard = ({ job }) => {
    const getPackageIcon = (type) => {
      if (type === 'electronics') {
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      }
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
        </svg>
      );
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        {/* Header with Job ID and Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-gray-900">{job.id}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {job.status}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">{job.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">{job.driver.name}</div>
              <div className="text-sm text-gray-500">{job.serviceType}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleContactDriver(job.driver, 'call')}
              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button
              onClick={() => handleContactDriver(job.driver, 'message')}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pickup Information */}
        <div className="mb-3">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{job.pickup.category}</div>
              <div className="text-sm text-gray-600">{job.pickup.location}</div>
              <div className="text-xs text-gray-500">{job.pickup.address}</div>
              <div className="text-xs text-blue-600 font-medium mt-1">{job.pickup.time}</div>
            </div>
          </div>
        </div>

        {/* Destination Information */}
        <div className="mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{job.destination.location}</div>
              <div className="text-xs text-gray-500">{job.destination.address}</div>
              <div className="text-xs text-green-600 font-medium mt-1">{job.destination.time}</div>
            </div>
          </div>
        </div>

        {/* Package Info and ETA */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {getPackageIcon(job.package.icon)}
              <span className="text-sm font-medium text-gray-700">{job.package.weight}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">ETA: {job.eta}</div>
              {job.canTrack && (
                <button
                  onClick={() => handleTrackJob(job)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Track Live
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => handleViewDetails(job)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            View Details
          </button>
          <button
            onClick={() => handleContactDriver(job.driver, 'call')}
            className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-5 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
            <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Get jobs to display based on active filter
  const getJobsToDisplay = () => {
    if (activeFilter === 'active') {
      return sampleJobs.filter(job => job.status === 'In Route' || job.status === 'Loading');
    }
    return sampleJobs; // For demo purposes, show sample jobs for all filters
  };

  const jobsToDisplay = getJobsToDisplay().slice(0, displayedJobs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">My Jobs</h1>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSearch}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={handleFilterToggle}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar (Conditional) */}
          {showSearch && (
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by job ID or location..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-sm"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeFilter === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job List Content */}
      <div className="px-4 py-6">
        {loading ? (
          <LoadingSkeleton />
        ) : jobsToDisplay.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-500 max-w-sm">
              {searchQuery ? 'No jobs match your search criteria.' : `No ${activeFilter} jobs available.`}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobsToDisplay.map((job, index) => (
                <EnhancedJobCard key={`${job.id}-${index}`} job={job} />
              ))}
            </div>

            {/* Load More Button */}
            {jobsToDisplay.length >= displayedJobs && jobsToDisplay.length < getJobsToDisplay().length && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Load More Jobs
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyJobsScreen;