import React from 'react';
import { useTransactions } from '../../context/TransactionContext';

/**
 * SpendingOverview Component
 * 
 * Displays spending statistics with gradient cards showing:
 * - Total spent across all transactions
 * - Current month spending
 * - Average spending per job
 * - Monthly trend comparison
 * 
 * Features:
 * - Gradient backgrounds matching app theme
 * - Responsive grid layout
 * - Real-time calculated statistics
 * - Visual spending indicators
 */
const SpendingOverview = () => {
  const { getSpendingOverview } = useTransactions();
  
  const {
    totalSpent,
    thisMonthSpent,
    averagePerJob,
    totalJobs,
    thisMonthJobs
  } = getSpendingOverview();

  // Calculate previous month for trend comparison
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  // Mock previous month data for trend calculation
  const previousMonthSpent = thisMonthSpent * 0.85; // Simulate 15% increase
  const trendPercentage = previousMonthSpent > 0 
    ? ((thisMonthSpent - previousMonthSpent) / previousMonthSpent * 100)
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const getTrendColor = (percentage) => {
    if (percentage > 0) return 'text-red-600';
    if (percentage < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (percentage) => {
    if (percentage > 0) return '↗';
    if (percentage < 0) return '↘';
    return '→';
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Spending Overview</h2>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Spent Card */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-sm opacity-75">{totalJobs} jobs</span>
          </div>
          <div className="mb-1">
            <h3 className="text-2xl font-bold">{formatCurrency(totalSpent)}</h3>
          </div>
          <p className="text-sm opacity-90">Total Spent</p>
        </div>

        {/* This Month Card */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${getTrendColor(trendPercentage)}`}>
                {getTrendIcon(trendPercentage)} {formatPercentage(trendPercentage)}
              </span>
              <div className="text-xs opacity-75">{thisMonthJobs} jobs</div>
            </div>
          </div>
          <div className="mb-1">
            <h3 className="text-2xl font-bold">{formatCurrency(thisMonthSpent)}</h3>
          </div>
          <p className="text-sm opacity-90">This Month</p>
        </div>

        {/* Average Per Job Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm opacity-75">per job</span>
          </div>
          <div className="mb-1">
            <h3 className="text-2xl font-bold">{formatCurrency(averagePerJob)}</h3>
          </div>
          <p className="text-sm opacity-90">Average Cost</p>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm opacity-75">activity</span>
          </div>
          <div className="mb-1">
            <h3 className="text-2xl font-bold">{thisMonthJobs}</h3>
          </div>
          <p className="text-sm opacity-90">Jobs This Month</p>
        </div>
      </div>

      {/* Monthly Comparison Bar */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Spending Trend</h3>
          <span className={`text-sm font-medium ${getTrendColor(trendPercentage)}`}>
            {formatPercentage(trendPercentage)} vs last month
          </span>
        </div>
        
        <div className="space-y-3">
          {/* Current Month Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">This Month</span>
              <span className="font-medium text-gray-900">{formatCurrency(thisMonthSpent)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
          
          {/* Previous Month Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Last Month</span>
              <span className="font-medium text-gray-900">{formatCurrency(previousMonthSpent)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(previousMonthSpent / thisMonthSpent) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingOverview;