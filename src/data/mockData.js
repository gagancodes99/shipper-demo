/**
 * Mock data for the Phoenix Prime Shipper application
 * Contains address book data and other static data used throughout the app
 */

/**
 * Mock addresses for the address book functionality
 * @type {Array<{id: number, name: string, address: string, suburb: string, postcode: string, isDefault: boolean}>}
 */
export const mockAddresses = [
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

/**
 * Step names for the 8-step booking flow
 * Used consistently across all progress bars
 * @type {Array<string>}
 */
export const stepNames = [
  'Job Type', 
  'Location Count', 
  'Location & Goods', 
  'Vehicle', 
  'Transfer', 
  'Review', 
  'Payment', 
  'Confirmation'
];

/**
 * Total number of steps in the booking flow
 * @type {number}
 */
export const totalSteps = 8;

/**
 * Job type options for the booking flow
 * @type {Array<{id: string, label: string, icon: string, desc: string}>}
 */
export const jobTypes = [
  { 
    id: 'single', 
    label: 'Single Pickup/Drop', 
    icon: '🚚', 
    desc: 'One pickup, one delivery' 
  },
  { 
    id: 'multi-pickup', 
    label: 'Multi-Pickup', 
    icon: '📦', 
    desc: 'Multiple pickups, one delivery' 
  },
  { 
    id: 'multi-drop', 
    label: 'Multi-Drop', 
    icon: '📍', 
    desc: 'One pickup, multiple deliveries' 
  }
];

/**
 * Default job data structure
 * @type {Object}
 */
export const defaultJobData = {
  jobType: '',
  pickupCount: 1,
  deliveryCount: 1,
  pickups: [],
  deliveries: [],
  pickupGoods: [],
  deliveryGoods: [],
  vehicle: null,
  truckBodyType: '',
  isRefrigerated: false,
  craneHiabOption: ''
};