import React from 'react';
import { useTransactions } from '../../context/TransactionContext';

/**
 * TransactionCard Component
 * 
 * Displays individual transaction information in a card format with:
 * - Transaction ID and date
 * - Job reference with link to job details
 * - Amount and payment method
 * - Color-coded status indicators
 * - Quick action buttons (View Receipt, Refund Request)
 * 
 * Props:
 * - transaction: Transaction object containing all transaction details
 * - onViewDetails: Function to handle viewing full transaction details
 * - onViewJob: Function to handle viewing related job details
 */
const TransactionCard = ({ transaction, onViewDetails, onViewJob }) => {
  const { generateReceipt, requestRefund, isLoading } = useTransactions();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: {
        label: 'Paid',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        dotColor: 'bg-green-500',
        icon: '✓'
      },
      pending: {
        label: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        dotColor: 'bg-yellow-500',
        icon: '⏳'
      },
      failed: {
        label: 'Failed',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        dotColor: 'bg-red-500',
        icon: '✗'
      },
      refund: {
        label: 'Refunded',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        dotColor: 'bg-blue-500',
        icon: '↩'
      },
      partial: {
        label: 'Partial',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        dotColor: 'bg-orange-500',
        icon: '½'
      }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      visa_card: '💳',
      mastercard: '💳',
      amex: '💳',
      paypal: '🅿',
      bank_transfer: '🏦',
      cash_on_delivery: '💵',
      wallet: '👛'
    };
    return icons[method] || '💳';
  };

  const getPaymentMethodLabel = (method, details) => {
    const labels = {
      visa_card: `Visa •••• ${details?.last4 || '****'}`,
      mastercard: `Mastercard •••• ${details?.last4 || '****'}`,
      amex: `Amex •••• ${details?.last4 || '****'}`,
      paypal: details?.email || 'PayPal',
      bank_transfer: details?.bank || 'Bank Transfer',
      cash_on_delivery: 'Cash on Delivery',
      wallet: details?.wallet || 'Digital Wallet'
    };
    return labels[method] || 'Unknown Payment Method';
  };

  const statusConfig = getStatusConfig(transaction.status);

  const handleDownloadReceipt = async () => {
    try {
      const receipt = await generateReceipt(transaction.id);
      if (receipt) {
        // In a real app, this would trigger a download or open in new tab
        window.open(receipt.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate receipt:', error);
    }
  };

  const handleRefundRequest = async () => {
    if (window.confirm('Are you sure you want to request a refund for this transaction?')) {
      try {
        await requestRefund(transaction.id, 'Customer request');
        alert('Refund request submitted successfully');
      } catch (error) {
        console.error('Failed to request refund:', error);
        alert('Failed to submit refund request');
      }
    }
  };

  const canRefund = transaction.status === 'paid' && !transaction.refundStatus;
  const hasReceipt = transaction.status === 'paid' || transaction.receiptUrl;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{transaction.id}</h3>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
              <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></span>
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
          {transaction.status === 'failed' && transaction.errorMessage && (
            <p className="text-xs text-red-600 mt-1">{transaction.errorMessage}</p>
          )}
        </div>
      </div>

      {/* Job Reference */}
      <div className="mb-4">
        <button
          onClick={() => onViewJob?.(transaction.jobId)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <span className="text-sm font-medium">{transaction.jobId}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
      </div>

      {/* Payment Method */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-lg">{getPaymentMethodIcon(transaction.paymentMethod)}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {getPaymentMethodLabel(transaction.paymentMethod, transaction.paymentMethodDetails)}
          </p>
          <p className="text-xs text-gray-500">Payment Method</p>
        </div>
      </div>

      {/* Refund Status */}
      {transaction.refundStatus && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="text-sm font-medium text-blue-900">
              Refund {transaction.refundStatus.status === 'completed' ? 'Completed' : 'Processing'}
            </span>
          </div>
          <p className="text-xs text-blue-700">
            {formatCurrency(transaction.refundStatus.amount)} • {formatDate(transaction.refundStatus.date)}
          </p>
          <p className="text-xs text-blue-600 mt-1">{transaction.refundStatus.reason}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails?.(transaction)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </button>

        {hasReceipt && (
          <button
            onClick={handleDownloadReceipt}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Receipt
          </button>
        )}

        {canRefund && (
          <button
            onClick={handleRefundRequest}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Refund
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;