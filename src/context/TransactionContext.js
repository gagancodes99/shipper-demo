import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * TransactionContext - Manages payment transactions and financial data
 * 
 * Features:
 * - Transaction state management and persistence
 * - Payment processing integration
 * - Transaction history and filtering
 * - Link transactions to jobs
 * - Spending calculations and statistics
 * - Receipt generation and management
 */

const TransactionContext = createContext(null);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

// Transaction status constants
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

// Transaction type constants
export const TRANSACTION_TYPE = {
  PAYMENT: 'payment',
  REFUND: 'refund',
  PARTIAL_REFUND: 'partial_refund',
  ADJUSTMENT: 'adjustment'
};

// Payment method constants
export const PAYMENT_METHOD = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  DIGITAL_WALLET: 'digital_wallet',
  CASH: 'cash'
};

export const TransactionProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Load transactions from localStorage on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserTransactions();
    }
  }, [isAuthenticated, user]);

  /**
   * Load transactions from localStorage for the current user
   */
  const loadUserTransactions = () => {
    try {
      setIsLoading(true);
      const storageKey = `phoenixPrime_transactions_${user.id}`;
      const storedTransactions = localStorage.getItem(storageKey);
      
      if (storedTransactions) {
        const transactionData = JSON.parse(storedTransactions);
        setTransactions(transactionData);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save transactions to localStorage
   * @param {Array} transactionsToSave - Transactions array to save
   */
  const saveTransactionsToStorage = (transactionsToSave) => {
    if (!user) return;
    
    try {
      const storageKey = `phoenixPrime_transactions_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(transactionsToSave));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} - Created transaction object
   */
  const createTransaction = async (transactionData) => {
    try {
      const newTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        
        // Basic transaction information
        jobId: transactionData.jobId || null,
        type: transactionData.type || TRANSACTION_TYPE.PAYMENT,
        status: transactionData.status || TRANSACTION_STATUS.PENDING,
        
        // Financial information
        amount: parseFloat(transactionData.amount) || 0,
        currency: transactionData.currency || 'AUD',
        fees: parseFloat(transactionData.fees) || 0,
        netAmount: parseFloat(transactionData.amount) - parseFloat(transactionData.fees || 0),
        
        // Payment information
        paymentMethod: transactionData.paymentMethod || PAYMENT_METHOD.CREDIT_CARD,
        paymentDetails: {
          cardLast4: transactionData.cardLast4 || null,
          cardBrand: transactionData.cardBrand || null,
          bankName: transactionData.bankName || null,
          accountNumber: transactionData.accountNumber || null,
          ...transactionData.paymentDetails
        },
        
        // References and tracking
        reference: generateTransactionReference(),
        externalReference: transactionData.externalReference || null,
        receiptNumber: generateReceiptNumber(),
        
        // Description and metadata
        description: transactionData.description || 'Phoenix Prime Shipping Service',
        notes: transactionData.notes || '',
        
        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        processedAt: transactionData.processedAt || null,
        
        // Customer information
        customerInfo: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          businessName: user.businessName
        },
        
        // Additional metadata
        metadata: {
          ipAddress: transactionData.ipAddress || null,
          userAgent: transactionData.userAgent || null,
          source: 'web_app',
          ...transactionData.metadata
        }
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      saveTransactionsToStorage(updatedTransactions);
      
      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  /**
   * Update transaction status
   * @param {string} transactionId - Transaction ID
   * @param {string} newStatus - New status
   * @param {Object} additionalData - Additional data to update
   * @returns {Promise<Object>} - Updated transaction
   */
  const updateTransactionStatus = async (transactionId, newStatus, additionalData = {}) => {
    try {
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id === transactionId) {
          const updatedTransaction = {
            ...transaction,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            ...additionalData
          };

          // Set processedAt when transaction completes
          if (newStatus === TRANSACTION_STATUS.COMPLETED && !transaction.processedAt) {
            updatedTransaction.processedAt = new Date().toISOString();
          }

          return updatedTransaction;
        }
        return transaction;
      });

      setTransactions(updatedTransactions);
      saveTransactionsToStorage(updatedTransactions);
      
      return updatedTransactions.find(t => t.id === transactionId);
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  };

  /**
   * Process payment for a job
   * @param {Object} jobData - Job data
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} - Created transaction
   */
  const processPayment = async (jobData, paymentData) => {
    try {
      // Create transaction with processing status
      const transaction = await createTransaction({
        jobId: jobData.id || null,
        type: TRANSACTION_TYPE.PAYMENT,
        status: TRANSACTION_STATUS.PROCESSING,
        amount: paymentData.amount,
        paymentMethod: paymentData.method,
        cardLast4: paymentData.cardLast4,
        cardBrand: paymentData.cardBrand,
        description: `Payment for ${jobData.jobType} shipping service`,
        notes: paymentData.notes || ''
      });

      // Simulate payment processing delay
      setTimeout(async () => {
        try {
          // Simulate successful payment (90% success rate)
          const success = Math.random() > 0.1;
          
          if (success) {
            await updateTransactionStatus(
              transaction.id, 
              TRANSACTION_STATUS.COMPLETED,
              {
                externalReference: `ext_${Date.now()}`,
                processedAt: new Date().toISOString()
              }
            );
          } else {
            await updateTransactionStatus(
              transaction.id, 
              TRANSACTION_STATUS.FAILED,
              {
                failureReason: 'Payment declined by bank'
              }
            );
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          await updateTransactionStatus(transaction.id, TRANSACTION_STATUS.FAILED);
        }
      }, 2000);

      return transaction;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  };

  /**
   * Process refund for a transaction
   * @param {string} originalTransactionId - Original transaction ID
   * @param {number} refundAmount - Amount to refund
   * @param {string} reason - Refund reason
   * @returns {Promise<Object>} - Created refund transaction
   */
  const processRefund = async (originalTransactionId, refundAmount, reason = '') => {
    try {
      const originalTransaction = transactions.find(t => t.id === originalTransactionId);
      if (!originalTransaction) {
        throw new Error('Original transaction not found');
      }

      const isPartialRefund = refundAmount < originalTransaction.netAmount;
      
      const refundTransaction = await createTransaction({
        jobId: originalTransaction.jobId,
        type: isPartialRefund ? TRANSACTION_TYPE.PARTIAL_REFUND : TRANSACTION_TYPE.REFUND,
        status: TRANSACTION_STATUS.PROCESSING,
        amount: -Math.abs(refundAmount), // Negative amount for refunds
        paymentMethod: originalTransaction.paymentMethod,
        description: `Refund for transaction ${originalTransaction.reference}`,
        notes: reason,
        metadata: {
          originalTransactionId: originalTransactionId,
          refundReason: reason
        }
      });

      // Simulate refund processing
      setTimeout(async () => {
        await updateTransactionStatus(refundTransaction.id, TRANSACTION_STATUS.COMPLETED);
      }, 1500);

      return refundTransaction;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  };

  /**
   * Get filtered transactions
   * @returns {Array} - Filtered transactions array
   */
  const getFilteredTransactions = () => {
    let filteredTransactions = [...transactions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.reference.toLowerCase().includes(query) ||
        transaction.receiptNumber.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.customerInfo.name.toLowerCase().includes(query) ||
        (transaction.customerInfo.businessName && transaction.customerInfo.businessName.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filteredTransactions = filteredTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
      });
    }

    // Sort by creation date (newest first)
    return filteredTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  /**
   * Get transaction statistics
   * @returns {Object} - Transaction statistics
   */
  const getTransactionStats = () => {
    const completedTransactions = transactions.filter(t => t.status === TRANSACTION_STATUS.COMPLETED);
    const totalRevenue = completedTransactions
      .filter(t => t.amount > 0)
      .reduce((total, t) => total + t.netAmount, 0);
    
    const totalRefunds = completedTransactions
      .filter(t => t.amount < 0)
      .reduce((total, t) => total + Math.abs(t.netAmount), 0);
    
    const netRevenue = totalRevenue - totalRefunds;
    
    const totalFees = completedTransactions.reduce((total, t) => total + t.fees, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenue = completedTransactions
      .filter(t => new Date(t.createdAt) >= thisMonth && t.amount > 0)
      .reduce((total, t) => total + t.netAmount, 0);

    return {
      totalTransactions: transactions.length,
      completedTransactions: completedTransactions.length,
      totalRevenue,
      totalRefunds,
      netRevenue,
      totalFees,
      monthlyRevenue,
      averageTransactionValue: completedTransactions.length > 0 
        ? totalRevenue / completedTransactions.filter(t => t.amount > 0).length 
        : 0
    };
  };

  /**
   * Get transactions by job ID
   * @param {string} jobId - Job ID
   * @returns {Array} - Transactions for the job
   */
  const getTransactionsByJobId = (jobId) => {
    return transactions.filter(t => t.jobId === jobId);
  };

  /**
   * Get recent transactions (last 30 days)
   * @returns {Array} - Recent transactions
   */
  const getRecentTransactions = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return transactions
      .filter(t => new Date(t.createdAt) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Helper functions

  /**
   * Generate transaction reference
   * @returns {string} - Transaction reference
   */
  const generateTransactionReference = () => {
    const prefix = 'TXN';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  /**
   * Generate receipt number
   * @returns {string} - Receipt number
   */
  const generateReceiptNumber = () => {
    const prefix = 'RCP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const contextValue = {
    // State
    transactions,
    isLoading,
    searchQuery,
    statusFilter,
    typeFilter,
    dateRange,
    
    // Actions
    createTransaction,
    updateTransactionStatus,
    processPayment,
    processRefund,
    
    // Filters and Search
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    setDateRange,
    getFilteredTransactions,
    getTransactionsByJobId,
    
    // Statistics and Analytics
    getTransactionStats,
    getRecentTransactions,
    
    // Constants
    TRANSACTION_STATUS,
    TRANSACTION_TYPE,
    PAYMENT_METHOD
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;