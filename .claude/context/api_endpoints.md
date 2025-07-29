# Phoenix Prime Shipper - API Endpoints & Integration Patterns

## Current API Status

**Note**: The Phoenix Prime Shipper application currently operates with **mock data** and **no external API integrations**. This document outlines the patterns that would be needed for production API integration and the current mock data structures.

## Mock Data Patterns

### Address Book Mock Data
```javascript
// Current mock addresses in App.js
const mockAddresses = [
  { 
    id: 1, 
    name: "John Smith", 
    address: "123 Main St", 
    suburb: "Sydney", 
    postcode: "2000", 
    isDefault: true 
  },
  { 
    id: 2, 
    name: "ABC Warehouse", 
    address: "456 Industrial Ave", 
    suburb: "Melbourne", 
    postcode: "3000", 
    isDefault: false 
  },
  { 
    id: 3, 
    name: "XYZ Logistics", 
    address: "789 Transport Rd", 
    suburb: "Brisbane", 
    postcode: "4000", 
    isDefault: false 
  }
];
```

### Vehicle Data Mock
```javascript
// Mock vehicle data structure (implied from VehicleSelectionScreen)
const mockVehicles = [
  {
    id: 'van',
    name: 'Delivery Van',
    capacity: 1000, // kg
    dimensions: { length: 3, width: 1.8, height: 1.8 }, // meters
    costPerKm: 2.5,
    baseCost: 50
  },
  {
    id: 'truck',
    name: 'Medium Truck',
    capacity: 3000,
    dimensions: { length: 6, width: 2.4, height: 2.4 },
    costPerKm: 4.0,
    baseCost: 100
  },
  {
    id: 'large-truck',
    name: 'Large Truck',
    capacity: 8000,
    dimensions: { length: 12, width: 2.4, height: 2.8 },
    costPerKm: 6.0,
    baseCost: 200
  }
];
```

## Future API Integration Patterns

### Authentication & Authorization
```javascript
// API client configuration pattern
const apiClient = {
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  }
};

// Auth token management
const getAuthToken = () => localStorage.getItem('phoenix_auth_token');
const setAuthToken = (token) => localStorage.setItem('phoenix_auth_token', token);
const clearAuthToken = () => localStorage.removeItem('phoenix_auth_token');
```

### Address Management API
```javascript
// GET /api/addresses
const fetchAddresses = async (userId) => {
  const response = await fetch(`${apiClient.baseURL}/addresses?userId=${userId}`, {
    headers: apiClient.headers
  });
  return response.json();
};

// POST /api/addresses
const createAddress = async (addressData) => {
  const response = await fetch(`${apiClient.baseURL}/addresses`, {
    method: 'POST',
    headers: apiClient.headers,
    body: JSON.stringify(addressData)
  });
  return response.json();
};

// PUT /api/addresses/:id
const updateAddress = async (addressId, updates) => {
  const response = await fetch(`${apiClient.baseURL}/addresses/${addressId}`, {
    method: 'PUT',
    headers: apiClient.headers,
    body: JSON.stringify(updates)
  });
  return response.json();
};

// Expected API response format
const addressResponse = {
  id: string,
  userId: string,
  name: string,
  address: string,
  suburb: string,
  state: string,
  postcode: string,
  country: string,
  isDefault: boolean,
  businessHours: {
    monday: { open: '09:00', close: '17:00', closed: false },
    // ... other days
  },
  contactPerson: string,
  phone: string,
  email: string,
  accessInstructions: string,
  createdAt: string,
  updatedAt: string
};
```

### Vehicle & Pricing API
```javascript
// GET /api/vehicles/available
const fetchAvailableVehicles = async (requirements) => {
  const queryParams = new URLSearchParams({
    minCapacity: requirements.totalWeight,
    serviceDate: requirements.pickupDate,
    origin: requirements.originPostcode,
    destination: requirements.destinationPostcode
  });
  
  const response = await fetch(`${apiClient.baseURL}/vehicles/available?${queryParams}`, {
    headers: apiClient.headers
  });
  return response.json();
};

// POST /api/pricing/calculate
const calculatePricing = async (jobData) => {
  const response = await fetch(`${apiClient.baseURL}/pricing/calculate`, {
    method: 'POST',
    headers: apiClient.headers,
    body: JSON.stringify({
      jobType: jobData.type,
      pickups: jobData.pickups.map(p => ({
        postcode: p.address.postcode,
        weight: calculateLocationWeight(p.goods),
        packagingTypes: getPackagingTypes(p.goods)
      })),
      deliveries: jobData.deliveries.map(d => ({
        postcode: d.address.postcode,
        weight: calculateLocationWeight(d.goods),
        packagingTypes: getPackagingTypes(d.goods)
      })),
      vehicle: jobData.vehicle,
      transferType: jobData.transferType
    })
  });
  return response.json();
};

// Expected pricing response
const pricingResponse = {
  baseRate: number,
  distanceRate: number,
  totalDistance: number,
  fuelSurcharge: number,
  packagingFees: {
    pallets: number,
    boxes: number,
    bags: number,
    loose: number
  },
  additionalServices: {
    palletTransfer: number,
    afterHours: number,
    waitTime: number
  },
  subtotal: number,
  gst: number,
  total: number,
  currency: 'AUD'
};
```

### Job Booking API
```javascript
// POST /api/jobs
const createBooking = async (jobData) => {
  const response = await fetch(`${apiClient.baseURL}/jobs`, {
    method: 'POST',
    headers: apiClient.headers,
    body: JSON.stringify({
      type: jobData.type,
      pickups: jobData.pickups,
      deliveries: jobData.deliveries,
      vehicle: jobData.vehicle,
      transferType: jobData.transferType,
      specialInstructions: jobData.specialInstructions,
      totalWeight: jobData.totalWeight,
      totalCost: jobData.totalCost,
      paymentMethod: jobData.payment.method,
      customerDetails: jobData.customer
    })
  });
  return response.json();
};

// GET /api/jobs/:id
const fetchJobDetails = async (jobId) => {
  const response = await fetch(`${apiClient.baseURL}/jobs/${jobId}`, {
    headers: apiClient.headers
  });
  return response.json();
};

// PUT /api/jobs/:id/status
const updateJobStatus = async (jobId, status) => {
  const response = await fetch(`${apiClient.baseURL}/jobs/${jobId}/status`, {
    method: 'PUT',
    headers: apiClient.headers,
    body: JSON.stringify({ status })
  });
  return response.json();
};

// Expected job response
const jobResponse = {
  id: string,
  jobNumber: string,
  status: 'pending' | 'confirmed' | 'in-transit' | 'completed' | 'cancelled',
  type: string,
  pickups: Array,
  deliveries: Array,
  vehicle: Object,
  driver: {
    id: string,
    name: string,
    phone: string,
    licenseNumber: string
  },
  tracking: {
    qrCode: string,
    barcode: string,
    trackingUrl: string
  },
  timeline: [
    {
      status: string,
      timestamp: string,
      location: string,
      notes: string
    }
  ],
  documents: {
    jobSheet: string, // PDF URL
    pickupReceipts: Array<string>,
    deliveryReceipts: Array<string>,
    photos: Array<string>
  },
  createdAt: string,
  updatedAt: string
};
```

### Payment Integration API
```javascript
// POST /api/payments/process
const processPayment = async (paymentData) => {
  const response = await fetch(`${apiClient.baseURL}/payments/process`, {
    method: 'POST',
    headers: apiClient.headers,
    body: JSON.stringify({
      jobId: paymentData.jobId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.method,
      cardDetails: paymentData.cardDetails, // Encrypted
      billingAddress: paymentData.billingAddress
    })
  });
  return response.json();
};

// Expected payment response
const paymentResponse = {
  transactionId: string,
  status: 'pending' | 'completed' | 'failed',
  amount: number,
  currency: string,
  paymentMethod: string,
  receiptUrl: string,
  failureReason?: string,
  processedAt: string
};
```

### Tracking & Notifications API
```javascript
// GET /api/jobs/:id/tracking
const fetchTrackingInfo = async (jobId) => {
  const response = await fetch(`${apiClient.baseURL}/jobs/${jobId}/tracking`, {
    headers: apiClient.headers
  });
  return response.json();
};

// POST /api/notifications/send
const sendNotification = async (notificationData) => {
  const response = await fetch(`${apiClient.baseURL}/notifications/send`, {
    method: 'POST',
    headers: apiClient.headers,
    body: JSON.stringify({
      jobId: notificationData.jobId,
      type: notificationData.type, // 'sms' | 'email' | 'push'
      recipient: notificationData.recipient,
      template: notificationData.template,
      data: notificationData.data
    })
  });
  return response.json();
};
```

### Document Generation API
```javascript
// POST /api/documents/generate
const generateJobDocuments = async (jobId, documentTypes) => {
  const response = await fetch(`${apiClient.baseURL}/documents/generate`, {
    method: 'POST',
    headers: apiClient.headers,
    body: JSON.stringify({
      jobId,
      documentTypes: documentTypes, // ['job-sheet', 'pickup-receipt', 'delivery-receipt']
      format: 'pdf'
    })
  });
  return response.json();
};

// GET /api/documents/:id/download
const downloadDocument = async (documentId) => {
  const response = await fetch(`${apiClient.baseURL}/documents/${documentId}/download`, {
    headers: apiClient.headers
  });
  return response.blob();
};
```

## Error Handling Patterns

### API Error Response Format
```javascript
const apiErrorResponse = {
  error: {
    code: string, // 'VALIDATION_ERROR', 'NOT_FOUND', 'UNAUTHORIZED'
    message: string,
    details: Array<{
      field: string,
      message: string
    }>
  },
  timestamp: string,
  requestId: string
};
```

### Error Handling Implementation
```javascript
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...apiClient.headers,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new APIError(errorData.error.message, response.status, errorData.error);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error occurred', 0, { code: 'NETWORK_ERROR' });
  }
};

class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'APIError';
  }
}
```

## Integration Points for Current App

### State Management Integration
```javascript
// Hook for API integration
const useJobBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createBooking = async (jobData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createBookingAPI(jobData);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createBooking, loading, error };
};
```

### Data Synchronization Patterns
```javascript
// Sync local state with API
const syncJobData = async (localJobData) => {
  // Validate required fields
  const validationErrors = validateJobData(localJobData);
  if (Object.keys(validationErrors).length > 0) {
    throw new ValidationError(validationErrors);
  }
  
  // Transform local state to API format
  const apiPayload = transformJobDataForAPI(localJobData);
  
  // Send to API
  const result = await createBooking(apiPayload);
  
  // Update local state with API response
  return transformAPIResponseToLocalState(result);
};
```

This document serves as a blueprint for future API integration while documenting the current mock data patterns used throughout the application.