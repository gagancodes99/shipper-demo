import React, { useState } from 'react';
import Header from '../ui/Header';
import ProgressBar from '../ui/ProgressBar';
import { useTransactions } from '../../context/TransactionContext';

/**
 * PaymentScreen Component
 * 
 * Handles payment processing with order summary and secure payment form.
 * Features credit/debit card payment with form validation and mock payment processing.
 * Includes GST calculation and provides both immediate payment and pay-later options.
 * 
 * Props:
 * - jobData: Object containing job information for cost calculation
 * - onNext: Function to proceed to confirmation after successful payment
 * - onBack: Function to go back to review screen
 * 
 * Component manages payment form state, validation, and simulated payment processing
 * with error handling and loading states.
 */
const PaymentScreen = ({ jobData, onNext, onBack }) => {
  const { addTransaction } = useTransactions();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const calculateTotal = () => {
    const baseRate = jobData.vehicle?.id === 'van' ? 80 : 150;
    const distanceMultiplier = 1.5;
    const subtotal = Math.round(baseRate * distanceMultiplier);
    const gst = Math.round(subtotal * 0.1);
    return { subtotal, gst, total: subtotal + gst };
  };

  const { subtotal, gst, total } = calculateTotal();

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    setTimeout(() => {
      const success = Math.random() > 0.3;
      const jobId = `JOB${Date.now().toString().slice(-6)}`;
      
      // Create transaction record
      const transactionData = {
        jobId,
        amount: total,
        subtotal,
        gst,
        serviceCharge: 0,
        discount: 0,
        status: success ? 'paid' : 'failed',
        paymentMethod: paymentMethod === 'card' ? 'visa_card' : paymentMethod,
        paymentMethodDetails: paymentMethod === 'card' ? {
          last4: cardDetails.number.slice(-4) || '****',
          brand: 'Visa'  // Could determine this from card number
        } : {},
        description: `${jobData.jobType} delivery - ${jobData.vehicle?.name || 'Vehicle'} service`,
        receiptUrl: success ? `/receipts/receipt_${Date.now()}.pdf` : null,
        refundStatus: null,
        jobType: jobData.jobType,
        vehicleType: jobData.vehicle?.id || 'van',
        errorMessage: success ? null : 'Payment processing failed'
      };

      const transaction = addTransaction(transactionData);
      
      if (success) {
        // Store job ID and transaction ID for confirmation screen
        jobData.jobId = jobId;
        jobData.transactionId = transaction.id;
        onNext();
      } else {
        setPaymentError('Payment failed. Please check your card details and try again.');
      }
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-sm mx-auto">
      <Header title="Payment" onBack={onBack} />
      <ProgressBar currentStep={7} totalSteps={8} stepNames={['Job Type', 'Location Count', 'Location & Goods', 'Vehicle', 'Transfer', 'Review', 'Payment', 'Confirmation']} />
      
      <div className="p-6 space-y-6">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Secure Payment</h2>
              <p className="text-sm opacity-90">Complete your booking with secure payment</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Shipping Service</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>GST (10%)</span>
              <span>${gst}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Method</h3>
          
          <div className="space-y-3 mb-6">
            <div
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border-2 rounded-lg cursor-pointer flex items-center transition-all ${
                paymentMethod === 'card' ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100' : 'border-slate-200'
              }`}
            >
              <span className="mr-3 text-xl">💳</span>
              <span>Credit/Debit Card</span>
              {paymentMethod === 'card' && <span className="ml-auto text-blue-500">✅</span>}
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="John Smith"
                />
              </div>
            </div>
          )}
        </div>

        {paymentError && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
            <div className="flex items-center text-red-800">
              <span className="mr-2">❌</span>
              <span className="font-medium">Payment Failed</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{paymentError}</p>
          </div>
        )}

        <button
         onClick={onNext}
          disabled={isProcessing || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center justify-center transform hover:scale-105 disabled:transform-none"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <span className="mr-2">💳</span>
              Pay ${total}
            </>
          )}
        </button>

        <button
          onClick={onNext}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-slate-500 to-slate-600 text-white p-4 rounded-lg font-medium hover:from-slate-600 hover:to-slate-700 transition-all flex items-center justify-center transform hover:scale-105 mt-3"
        >
          <span className="mr-2">📋</span>
          Pay Later - Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;
export { PaymentScreen };