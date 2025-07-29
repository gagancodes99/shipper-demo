import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';

/**
 * TransactionDetails Component
 * 
 * Displays comprehensive transaction breakdown including:
 * - Complete transaction information
 * - Service charges, taxes, and discounts breakdown
 * - Payment method information
 * - Receipt download/email options
 * - Refund status and history
 * - Related job information
 * 
 * Props:
 * - transaction: Complete transaction object
 * - onClose: Function to close the details modal/view
 * - onViewJob: Function to navigate to related job details
 */
const TransactionDetails = ({ transaction, onClose, onViewJob }) => {
  const { generateReceipt, requestRefund, isLoading } = useTransactions();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);

  if (!transaction) return null;

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: {
        label: 'Payment Successful',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: '✓'
      },
      pending: {
        label: 'Payment Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: '⏳'
      },
      failed: {
        label: 'Payment Failed',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: '✗'
      },
      refund: {
        label: 'Transaction Refunded',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        icon: '↩'
      }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentMethodDetails = (method, details) => {
    const methods = {
      visa_card: {
        name: 'Visa Credit Card',
        details: `•••• •••• •••• ${details?.last4 || '****'}`,
        icon: '💳'
      },
      mastercard: {
        name: 'Mastercard',
        details: `•••• •••• •••• ${details?.last4 || '****'}`,
        icon: '💳'
      },
      amex: {
        name: 'American Express',
        details: `•••• •••••• •${details?.last4 || '****'}`,
        icon: '💳'
      },
      paypal: {
        name: 'PayPal',
        details: details?.email || 'PayPal Account',
        icon: '🅿'
      },
      bank_transfer: {
        name: 'Bank Transfer',
        details: `${details?.bank || 'Bank'} - ${details?.account || '****1234'}`,
        icon: '🏦'
      },
      cash_on_delivery: {
        name: 'Cash on Delivery',
        details: 'Paid in cash to driver',
        icon: '💵'
      },
      wallet: {
        name: 'Digital Wallet',
        details: details?.wallet || 'Phoenix Wallet',
        icon: '👛'
      }
    };
    return methods[method] || { name: 'Unknown', details: 'Unknown payment method', icon: '❓' };
  };

  const statusConfig = getStatusConfig(transaction.status);
  const paymentMethodInfo = getPaymentMethodDetails(transaction.paymentMethod, transaction.paymentMethodDetails);

  const handleDownloadReceipt = async () => {
    try {
      const receipt = await generateReceipt(transaction.id);
      if (receipt) {
        const link = document.createElement('a');
        link.href = receipt.url;
        link.download = receipt.filename;
        link.click();
      }
    } catch (error) {
      console.error('Failed to download receipt:', error);
      alert('Failed to download receipt');
    }
  };

  const handleEmailReceipt = async () => {
    if (!emailAddress.trim()) return;

    setIsEmailSending(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Receipt sent to ${emailAddress}`);
      setShowEmailModal(false);
      setEmailAddress('');
    } catch (error) {
      console.error('Failed to email receipt:', error);
      alert('Failed to send receipt');
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleRefundRequest = async () => {
    if (window.confirm('Are you sure you want to request a refund for this transaction?')) {
      try {
        await requestRefund(transaction.id, 'Customer request from transaction details');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
            <p className="text-sm text-gray-500">{transaction.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{statusConfig.icon}</span>
              <div>
                <h3 className={`font-semibold ${statusConfig.textColor}`}>{statusConfig.label}</h3>
                <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
              </div>
            </div>
          </div>

          {/* Error Message for Failed Transactions */}
          {transaction.status === 'failed' && transaction.errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-red-900">Payment Failed</h4>
                  <p className="text-sm text-red-700">{transaction.errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Amount Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Amount Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(transaction.subtotal)}</span>
              </div>
              {transaction.serviceCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Charge</span>
                  <span className="font-medium">{formatCurrency(transaction.serviceCharge)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">GST (10%)</span>
                <span className="font-medium">{formatCurrency(transaction.gst)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied</span>
                  <span className="font-medium">-{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>{formatCurrency(transaction.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{paymentMethodInfo.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{paymentMethodInfo.name}</p>
                <p className="text-sm text-gray-600">{paymentMethodInfo.details}</p>
              </div>
            </div>
          </div>

          {/* Related Job Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Related Job</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">{transaction.jobId}</p>
                <p className="text-sm text-blue-700">{transaction.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                  <span>Type: {transaction.jobType}</span>
                  <span>Vehicle: {transaction.vehicleType}</span>
                </div>
              </div>
              <button
                onClick={() => onViewJob?.(transaction.jobId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Job
              </button>
            </div>
          </div>

          {/* Refund Information */}
          {transaction.refundStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Refund Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Refund Amount</span>
                  <span className="font-medium text-blue-900">{formatCurrency(transaction.refundStatus.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Refund Date</span>
                  <span className="font-medium">{formatDate(transaction.refundStatus.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${
                    transaction.refundStatus.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.refundStatus.status === 'completed' ? 'Completed' : 'Processing'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason</span>
                  <span className="font-medium">{transaction.refundStatus.reason}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {hasReceipt && (
              <>
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Receipt
                </button>

                <button
                  onClick={() => setShowEmailModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Receipt
                </button>
              </>
            )}

            {canRefund && (
              <button
                onClick={handleRefundRequest}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Request Refund
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Receipt</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the email address where you'd like to receive the receipt for transaction {transaction.id}.
            </p>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailReceipt}
                disabled={!emailAddress.trim() || isEmailSending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isEmailSending ? 'Sending...' : 'Send Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;