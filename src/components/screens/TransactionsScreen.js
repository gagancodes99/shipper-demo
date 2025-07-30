import React, { useState } from 'react';

/**
 * TransactionsScreen - Financial transaction history and management
 * 
 * Features:
 * - Transaction history with filtering
 * - Payment method management
 * - Invoice downloads
 * - Spending analytics
 * - Mobile-optimized transaction cards
 */

const TransactionsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock transactions data
  const transactions = [
    {
      id: 'TXN001',
      jobId: 'PPS001',
      type: 'payment',
      amount: 85.00,
      status: 'completed',
      date: '2025-01-29',
      time: '10:30 AM',
      method: 'Credit Card',
      description: 'Single Pickup - Sydney to Parramatta'
    },
    {
      id: 'TXN002',
      jobId: 'PPS002',
      type: 'payment',
      amount: 145.00,
      status: 'completed',
      date: '2025-01-28',
      time: '2:15 PM',
      method: 'PayPal',
      description: 'Multi-Drop - Melbourne CBD'
    },
    {
      id: 'TXN003',
      jobId: 'PPS004',
      type: 'refund',
      amount: 75.00,
      status: 'processing',
      date: '2025-01-27',
      time: '4:20 PM',
      method: 'Credit Card',
      description: 'Refund for cancelled job'
    },
    {
      id: 'TXN004',
      jobId: 'PPS005',
      type: 'payment',
      amount: 95.00,
      status: 'completed',
      date: '2025-01-26',
      time: '3:30 PM',
      method: 'Bank Transfer',
      description: 'Single Pickup - Adelaide CBD'
    }
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'payment', label: 'Payments' },
    { key: 'refund', label: 'Refunds' },
    { key: 'pending', label: 'Pending' }
  ];

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' },
    { key: 'year', label: 'This Year' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return transaction.status === 'processing';
    return transaction.type === activeFilter;
  });

  const totalSpent = transactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status, type) => {
    if (status === 'completed') {
      return type === 'refund' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600';
    }
    return 'bg-orange-100 text-orange-600';
  };

  const getTransactionIcon = (type) => {
    return type === 'refund' ? '↩️' : '💳';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-blue-100 mt-1">
              Track your payments and spending
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Total Spent</p>
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💰</span>
              <span className="text-lg font-bold text-gray-800">
                ${totalSpent.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Payments</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📊</span>
              <span className="text-lg font-bold text-gray-800">
                {transactions.length}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Transactions</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3">Time Period</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {periods.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
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

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Transactions Found</h3>
              <p className="text-gray-600 mb-4">
                No transactions match your current filter criteria.
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                {/* Transaction Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getTransactionIcon(transaction.type)}</span>
                    <div>
                      <p className="font-bold text-gray-800">#{transaction.id}</p>
                      <p className="text-xs text-gray-500">Job #{transaction.jobId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'refund' ? 'text-green-600' : 'text-gray-800'
                    }`}>
                      {transaction.type === 'refund' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(transaction.status, transaction.type)
                    }`}>
                      {transaction.status === 'completed' ? 'Completed' : 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3">{transaction.description}</p>

                {/* Transaction Details */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>💳 {transaction.method}</span>
                  <span>🕐 {transaction.date} at {transaction.time}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Payment Methods</h3>
            <button className="text-blue-500 font-medium text-sm">
              + Add New
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">💳</span>
                <div>
                  <p className="font-medium text-gray-800">•••• •••• •••• 1234</p>
                  <p className="text-xs text-gray-500">Visa - Default</p>
                </div>
              </div>
              <button className="text-blue-500 text-sm">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🅿️</span>
                <div>
                  <p className="font-medium text-gray-800">PayPal</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </div>
              <button className="text-blue-500 text-sm">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsScreen;