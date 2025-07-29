import React from 'react';
import { useJobs } from '../../context/JobsContext';

/**
 * JobStatsCards component displays job statistics in gradient cards
 * @param {Object} props - Component props
 * @param {Function} props.onCardClick - Callback function when a card is clicked
 * @returns {JSX.Element} Rendered job statistics cards
 */
const JobStatsCards = ({ onCardClick }) => {
  const { jobStats, loading } = useJobs();

  // Card configurations with gradients and icons
  const statsCards = [
    {
      id: 'active',
      title: 'Active Jobs',
      count: jobStats.active,
      icon: '🚛',
      gradient: 'from-orange-400 to-red-500',
      description: 'In progress',
      bgAccent: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      id: 'scheduled',
      title: 'Scheduled Jobs',
      count: jobStats.scheduled,
      icon: '📅',
      gradient: 'from-blue-400 to-purple-500',
      description: 'Upcoming',
      bgAccent: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'completed',
      title: 'Completed Jobs',
      count: jobStats.completed,
      icon: '✅',
      gradient: 'from-green-400 to-emerald-500',
      description: 'Total finished',
      bgAccent: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'total',
      title: 'Total Jobs',
      count: jobStats.total,
      icon: '📊',
      gradient: 'from-purple-400 to-pink-500',
      description: 'All time',
      bgAccent: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  const handleCardClick = (cardId) => {
    if (onCardClick) {
      onCardClick(cardId);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-8 bg-gray-300 rounded w-8"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card) => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card.id)}
          className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium opacity-90 mb-1">
                {card.title}
              </h3>
              <div className="text-3xl font-bold mb-1">
                {card.count}
              </div>
              <p className="text-xs opacity-75">
                {card.description}
              </p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                {card.icon}
              </div>
            </div>
          </div>
          
          {/* Bottom accent bar */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center text-xs opacity-75">
              <span>Click to view details</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobStatsCards;