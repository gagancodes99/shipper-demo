"use client";
import React, { useState } from "react";
import {
  CreditCard,
  Banknote,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const transactions = [
  {
    id: "#PP1001",
    date: "2024-01-15 14:30",
    amount: "$125.50",
    status: "Completed",
    title: "Electronics Package Delivery",
    route: "Downtown → Uptown",
    driver: "Mike Johnson",
    payment: "Credit Card **** 4532",
    method: "credit",
  },
  {
    id: "#PP1002",
    date: "2024-01-14 08:15",
    amount: "$180.75",
    status: "In Transit",
    title: "Furniture Delivery Service",
    route: "Industrial → Mall District",
    driver: "Sarah Chen",
    payment: "Credit Card **** 4532",
    method: "credit",
  },
  {
    id: "#PP0908",
    date: "2024-01-10 11:55",
    amount: "$95.25",
    status: "Completed",
    title: "Document Courier Service",
    route: "CBD → Suburbs",
    driver: "Alice Rodriguez",
    payment: "Bank Transfer",
    method: "bank",
  },
  {
    id: "#PP0997",
    date: "2024-01-12 16:20",
    amount: "+$75.00",
    status: "Cancelled",
    title: "Cancelled Delivery - Weather",
    route: "Cancelled",
    payment: "Credit Card **** 4532",
    refund: "Severe weather conditions",
  },
  {
    id: "#PP0996",
    date: "2024-01-11 08:30",
    amount: "$155.80",
    status: "Failed",
    title: "Medical Supplies Transport",
    route: "Hospital → Clinic",
    driver: "Emma Wilson",
    payment: "Credit Card **** 4532",
    failure: {
      reason: "Insufficient funds",
      attempts: 2,
    },
  },
];

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    amountRange: "",
  });

  // Calculate counts for each tab
  const getTransactionCounts = () => {
    return {
      all: transactions.length,
      paid: transactions.filter(tx => tx.status === "Completed").length,
      pending: transactions.filter(tx => tx.status === "In Transit").length,
      failed: transactions.filter(tx => tx.status === "Failed" || tx.status === "Cancelled").length,
    };
  };

  const counts = getTransactionCounts();

  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "paid", label: "Paid", count: counts.paid },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "failed", label: "Failed", count: counts.failed },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    // Filter by search query
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.driver?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.payment.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    let matchesTab = true;
    switch (activeTab) {
      case "paid":
        matchesTab = tx.status === "Completed";
        break;
      case "pending":
        matchesTab = tx.status === "In Transit";
        break;
      case "failed":
        matchesTab = tx.status === "Failed" || tx.status === "Cancelled";
        break;
      default:
        matchesTab = true;
    }

    // Filter by additional filters if they exist
    const matchesStatus = !filters.status || tx.status === filters.status;
    const matchesPaymentMethod = 
      !filters.paymentMethod || 
      (filters.paymentMethod === "credit" && tx.method === "credit") ||
      (filters.paymentMethod === "bank" && tx.method === "bank");

    return matchesSearch && matchesTab && matchesStatus && matchesPaymentMethod;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      paymentMethod: "",
      amountRange: "",
    });
  };

  return (
    <main className="max-w-md mx-auto px-4 py-6 space-y-4 font-sans bg-white min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Transactions</h2>
        <p className="text-gray-500 text-sm">Your payment history</p>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        <div className="flex-1 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-2xl p-4 relative overflow-hidden">
          <div className="text-sm">Total Spent</div>
          <div className="text-2xl font-bold">$3450.75</div>
          <div className="text-xs opacity-70 mt-1">All time</div>
          <DollarSign className="absolute top-3 right-3 w-5 h-5 opacity-80" />
        </div>
        <div className="flex-1 bg-gradient-to-tr from-green-600 to-green-400 text-white rounded-2xl p-4 relative overflow-hidden">
          <div className="text-sm">This Month</div>
          <div className="text-2xl font-bold">$890.25</div>
          <div className="text-xs mt-1 opacity-80">↝ 26.2% vs last month</div>
          <TrendingUp className="absolute top-3 right-3 w-5 h-5 opacity-80" />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-2 bg-gray-50 border px-3 py-2 rounded-xl">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="flex-1 bg-transparent outline-none text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Filters</h3>
            <button 
              onClick={resetFilters}
              className="text-blue-600 text-sm"
            >
              Reset
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Transit">In Transit</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="">All Methods</option>
              <option value="credit">Credit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Amount Range</label>
            <select
              name="amountRange"
              value={filters.amountRange}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="">All Amounts</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200+">$200+</option>
            </select>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-between text-sm font-medium text-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-full ${
              activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Pending banner - only show if on All or Pending tab */}
      {(activeTab === "all" || activeTab === "pending") && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <div>
            <p className="font-medium">Pending Payments</p>
            <p>$245.50 awaiting processing</p>
          </div>
        </div>
      )}

      {/* Transaction Cards */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <article
              key={tx.id}
              className="border rounded-2xl p-4 bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                {/* Left side: Icon + ID */}
                <span className="text-sm text-gray-600 font-medium flex items-center gap-1">
                  <DollarSign className="text-blue-600 w-4 h-4" />
                  {tx.id}
                </span>

                {/* Right side: Amount */}
                <span
                  className={`text-base font-bold ${
                    tx.amount.startsWith("+") ? "text-green-600" : "text-black"
                  }`}
                >
                  {tx.amount}
                </span>
              </div>

              <div className="text-xs text-gray-500">{tx.date}</div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{tx.title}</span>
                {tx.status === "Completed" && (
                  <span className="flex items-center text-xs text-green-600 font-semibold gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
                {tx.status === "In Transit" && (
                  <span className="flex items-center text-xs text-yellow-600 font-semibold gap-1">
                    <Clock className="w-4 h-4" />
                    In Transit
                  </span>
                )}
                {tx.status === "Failed" && (
                  <span className="flex items-center text-xs text-red-600 font-semibold gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Failed
                  </span>
                )}
                {tx.status === "Cancelled" && (
                  <span className="flex items-center text-xs text-orange-600 font-semibold gap-1">
                    <RotateCcw className="w-4 h-4" />
                    Cancelled
                  </span>
                )}
              </div>

              {/* Details in parallel layout */}
              <div className="space-y-2 mt-3">
                {tx.route && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Route:</span>
                    <span className="text-gray-700 font-medium">{tx.route}</span>
                  </div>
                )}
                
                {tx.driver && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Driver:</span>
                    <span className="text-gray-700">{tx.driver}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Payment:</span>
                  <span className="text-gray-700 flex items-center">
                    {tx.method === "credit" ? (
                      <CreditCard className="w-4 h-4 mr-1" />
                    ) : (
                      <Banknote className="w-4 h-4 mr-1" />
                    )}
                    {tx.payment}
                  </span>
                </div>
              </div>

              {/* Refund Info */}
              {tx.status === "Cancelled" && tx.refund && (
                <div className="bg-orange-50 text-orange-700 text-xs p-2 rounded-lg mt-2 border border-orange-200">
                  <p className="font-semibold">Refund Issued</p>
                  <p>{tx.refund}</p>
                </div>
              )}

              {/* Failure Info */}
              {tx.status === "Failed" && tx.failure && (
                <div className="bg-red-50 text-red-700 text-xs p-2 rounded-lg mt-2 border border-red-200">
                  <p className="font-semibold">Payment Failed</p>
                  <div className="flex justify-between mt-1">
                    <span>Reason:</span>
                    <span>{tx.failure.reason}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Attempts:</span>
                    <span>{tx.failure.attempts}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 gap-2">
                <button className="flex-1 text-white font-semibold text-sm bg-blue-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {tx.status === "Failed" && (
                  <button className="flex-1 text-white bg-green-600 hover:bg-green-700 text-sm font-semibold px-4 py-2 rounded-lg">
                    Retry
                  </button>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No transactions found matching your criteria
          </div>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="text-center mt-4">
          <button className="text-blue-600 text-sm font-medium hover:underline">
            Load More Transactions
          </button>
        </div>
      )}
    </main>
  );
}