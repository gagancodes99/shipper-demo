import React from 'react';

/**
 * DocumentsScreen Component
 * Documents and receipts interface with PDF downloads, package photos, and proof of delivery
 * Supports both standalone use and integration with job details tabbed interface
 */
const DocumentsScreen = ({ 
  documentsData = null, 
  onTabChange = null, 
  activeTab = 'documents',
  showTabs = true,
  onBack = null 
}) => {
  
  // Default documents data - can be overridden by props
  const defaultDocumentsData = {
    invoices: [
      {
        id: 'PP1001',
        type: 'invoice',
        amount: '$65.50',
        available: true,
        downloadUrl: '#',
        viewUrl: '#'
      }
    ],
    packagePhotos: [
      {
        id: 1,
        thumbnail: null,
        available: false
      },
      {
        id: 2,
        thumbnail: null,
        available: false
      }
    ],
    proofOfDelivery: {
      available: false,
      status: 'pending',
      description: 'Available after delivery'
    }
  };

  const data = documentsData || defaultDocumentsData;

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
      {['Overview', 'Tracking', 'Documents'].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange && onTabChange(tab.toLowerCase())}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.toLowerCase()
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  // Document icon component
  const DocumentIcon = ({ type, available = true }) => {
    const baseClasses = "w-10 h-10 rounded-lg flex items-center justify-center";
    const iconClasses = available 
      ? "bg-blue-100 text-blue-600" 
      : "bg-gray-100 text-gray-400";

    return (
      <div className={`${baseClasses} ${iconClasses}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  };

  // Download/View action buttons
  const ActionButtons = ({ onDownload, onView, available = true }) => {
    if (!available) return null;

    return (
      <div className="flex items-center space-x-2">
        <button 
          onClick={onDownload}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Download"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button 
          onClick={onView}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    );
  };

  // Camera placeholder component
  const CameraPlaceholder = () => (
    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
  );

  // Proof of delivery icon with checkmark
  const ProofOfDeliveryIcon = ({ available = false }) => {
    const baseClasses = "w-10 h-10 rounded-lg flex items-center justify-center relative";
    const iconClasses = available 
      ? "bg-green-100 text-green-600" 
      : "bg-gray-100 text-gray-400";

    return (
      <div className={`${baseClasses} ${iconClasses}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {available && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
      {/* Header - only show if used as standalone */}
      {onBack && (
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Documents & Receipts</h1>
              <div className="w-10 h-10"></div> {/* Spacer */}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-4">
        {/* Tab Navigation */}
        {showTabs && <TabNavigation />}

        {/* Documents & Receipts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Documents & Receipts</h2>
          
          <div className="space-y-3">
            {data.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <DocumentIcon type="invoice" available={invoice.available} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Invoice #{invoice.id}</h3>
                    <p className="text-sm text-gray-600">Amount: {invoice.amount}</p>
                  </div>
                </div>
                <ActionButtons 
                  available={invoice.available}
                  onDownload={() => console.log('Download invoice', invoice.id)}
                  onView={() => console.log('View invoice', invoice.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Package Photos Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Photos</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {data.packagePhotos.map((photo) => (
              <div key={photo.id}>
                <CameraPlaceholder />
              </div>
            ))}
          </div>
        </div>

        {/* Proof of Delivery Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof of Delivery</h3>
          
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <ProofOfDeliveryIcon available={data.proofOfDelivery.available} />
              <div>
                <h4 className="font-semibold text-gray-900">Proof of Delivery</h4>
                <p className="text-sm text-gray-500">{data.proofOfDelivery.description}</p>
              </div>
            </div>
            <div className="flex items-center">
              {data.proofOfDelivery.available ? (
                <ActionButtons 
                  available={true}
                  onDownload={() => console.log('Download proof of delivery')}
                  onView={() => console.log('View proof of delivery')}
                />
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {data.proofOfDelivery.status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Document Support</p>
                <p className="text-sm text-blue-600 mt-1">
                  If you need additional documents or have issues accessing your files, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Support
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsScreen;