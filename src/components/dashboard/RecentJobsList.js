import React from 'react';
import { useJobs } from '../../context/JobsContext';

/**
 * RecentJobsList component displays the most recent jobs with quick actions
 * @param {Object} props - Component props
 * @param {Function} props.onTrackJob - Callback function when track button is clicked
 * @param {Function} props.onViewAllJobs - Callback function when "View All Jobs" is clicked
 * @returns {JSX.Element} Rendered recent jobs list
 */
const RecentJobsList = ({ onTrackJob, onViewAllJobs }) => {
  const { recentJobs, loading } = useJobs();

  // Status configurations with colors and labels
  const statusConfig = {
    active: {
      label: 'Active',
      color: 'bg-orange-100 text-orange-800',
      dotColor: 'bg-orange-500'
    },
    scheduled: {
      label: 'Scheduled',
      color: 'bg-blue-100 text-blue-800',
      dotColor: 'bg-blue-500'
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-500'
    }
  };

  const handleTrackJob = (jobId) => {
    if (onTrackJob) {
      onTrackJob(jobId);
    }
  };

  const handleViewAllJobs = () => {
    if (onViewAllJobs) {
      onViewAllJobs();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const truncateAddress = (address, maxLength = 35) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-4 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentJobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Jobs</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No jobs yet</h3>
          <p className="text-gray-500">Your recent jobs will appear here once you start booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
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
        {recentJobs.map((job, index) => {
          const status = statusConfig[job.status];
          return (
            <div
              key={job.id}
              className={`border-b border-gray-100 pb-4 ${
                index === recentJobs.length - 1 ? 'border-b-0 pb-0' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-800">{job.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    <div className={`w-2 h-2 rounded-full ${status.dotColor} mr-1.5`}></div>
                    {status.label}
                  </span>
                </div>
                {job.status === 'active' && (
                  <button
                    onClick={() => handleTrackJob(job.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Track
                  </button>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 text-gray-500 font-medium">Pickup:</div>
                  <div className="flex-1">
                    <div className="text-gray-800">{truncateAddress(job.pickup.address)}</div>
                    <div className="text-gray-600">{job.pickup.contact} • {formatTime(job.pickup.time)}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 text-gray-500 font-medium">Delivery:</div>
                  <div className="flex-1">
                    <div className="text-gray-800">{truncateAddress(job.delivery.address)}</div>
                    <div className="text-gray-600">{job.delivery.contact} • {formatTime(job.delivery.time)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{job.vehicle}</span>
                    <span>•</span>
                    <span>{formatDate(job.scheduledDate)}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    ${job.totalCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recentJobs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleViewAllJobs}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            View All Jobs
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentJobsList;