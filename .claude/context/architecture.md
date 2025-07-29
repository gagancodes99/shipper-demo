# Phoenix Prime Shipper - System Architecture

## Application Architecture Overview

### High-Level Structure
```
Phoenix Prime Shipper (React 19.1.0 + Tailwind CSS)
├── Monolithic App Component (3,787 lines)
├── PDF Generation System (1,719+ lines)
├── 8-Step Booking Flow
├── Multi-Job Type Support
└── Advanced Packaging Management
```

## Core Components Architecture

### Main Application Structure
```
App.js (3,787 lines)
├── State Management (Centralized)
│   ├── jobData - Main job configuration
│   ├── currentStep - Flow navigation
│   ├── currentLocationIndex - Multi-location tracking
│   ├── currentGoodsIndex - Multi-goods tracking
│   └── addresses - Mock address book
├── Screen Components (8 screens)
│   ├── JobTypeScreen - Job type selection
│   ├── LocationCountScreen - Multi-location configuration
│   ├── LocationDetailsScreen - Address & scheduling
│   ├── GoodsDetailsScreen - Packaging configuration
│   ├── VehicleSelectionScreen - Vehicle matching
│   ├── TransferTypeScreen - Pallet transfer options
│   ├── ReviewScreen - Job summary & validation
│   ├── PaymentScreen - Payment processing
│   └── BookingConfirmedScreen - PDF generation & confirmation
├── Modal Components
│   ├── AddressBookModal - Address selection
│   ├── PalletConfigModal - Pallet configuration
│   └── GenericConfigModal - Box/bag configuration
└── Utility Components
    ├── ProgressBar - Step progress indicator
    └── Header - Navigation header
```

### PDF Generation Architecture
```
PDF System (Dual Implementation)
├── Legacy System (PDFGenerator.js - 1,719 lines)
│   ├── jsPDF + jsPDF-autotable
│   ├── Theme color matching
│   ├── QR code generation
│   ├── Barcode generation
│   └── Multi-page layouts
└── Modern System (ReactPDFGenerator.js)
    ├── @react-pdf/renderer
    ├── Component-based PDF generation
    ├── Theme integration
    └── Modular page layouts
```

## State Management Pattern

### Central State Structure
```javascript
jobData = {
  type: 'single|multi-pickup|multi-drop',
  locationCount: number,
  pickups: [
    {
      address: object,
      appointmentType: string,
      appointmentDate: string,
      appointmentTime: string,
      mobileNumber: string,
      goods: [ /* packaging objects */ ]
    }
  ],
  deliveries: [ /* similar to pickups */ ],
  vehicle: object,
  transferType: string,
  totalWeight: number,
  totalCost: number
}
```

### Flow Control State
```javascript
currentStep: 1-8,
currentLocationIndex: number,
currentGoodsIndex: number,
addresses: array
```

## Multi-Step Flow Architecture

### Navigation Logic
```
Step 1: Job Type Selection
├── Single → Step 2 (skip location count)
├── Multi-Pickup → Step 2 (location count)
└── Multi-Drop → Step 2 (location count)

Step 2: Location Count (conditional)
├── Single jobs skip this step
└── Multi jobs configure pickup/delivery counts

Step 3-4: Location & Goods Details
├── Data collection order depends on job type
├── Multi-pickup: delivery first, then pickups
├── Multi-drop: pickup first, then deliveries
└── Index synchronization for location/goods pairing

Step 5: Vehicle Selection
├── Capacity validation against total goods
└── Vehicle matching based on requirements

Step 6: Transfer Type (conditional)
├── Only shown for jobs with pallets
└── Pallet transfer requirements

Step 7: Review
├── Comprehensive job summary
├── Cost calculations
└── Validation checks

Step 8: Payment & Confirmation
├── Payment processing interface
└── PDF generation and download
```

## Job Type Logic Architecture

### Single Job Flow
```
Single Pickup/Drop
├── 1 pickup location
├── 1 delivery location
├── Sequential data collection
└── Simplified validation
```

### Multi-Pickup Flow
```
Multi-Pickup (N → 1)
├── 1 delivery location (collected first)
├── N pickup locations
├── Goods assigned to pickups
└── Consolidation logic
```

### Multi-Drop Flow
```
Multi-Drop (1 → N)
├── 1 pickup location (collected first)
├── N delivery locations
├── Goods distributed to deliveries
└── Distribution logic
```

## Packaging System Architecture

### Packaging Types Hierarchy
```
Packaging System
├── Pallets
│   ├── CHEP (standard blue)
│   ├── LOSCAM (standard blue)
│   ├── Plain Wood
│   └── Custom (with dimensions)
├── Boxes
│   ├── Weight validation
│   ├── Dimensional constraints
│   └── Fragile handling options
├── Bags
│   ├── Bulk packaging
│   └── Dimensional specifications
└── Loose Items
    ├── Individual item management
    └── Quantity tracking
```

### Validation Rules
```
Packaging Validation
├── Location Count Dependencies
│   ├── Single jobs: All packaging types available
│   ├── Multi jobs: Restricted packaging types
│   └── Conditional validation based on job complexity
├── Weight Constraints
│   ├── Box weight limits
│   ├── Vehicle capacity matching
│   └── Total weight calculations
└── Business Rules
    ├── Pallet security options
    ├── Fragile item handling
    └── Special requirements
```

## PDF Generation Architecture

### Master Summary Page
```
PDF Master Page
├── Job overview header
├── Pickup/delivery summary table
├── Goods breakdown by type
├── Vehicle and transfer details
├── Cost breakdown
├── QR code for mobile verification
└── Barcode for shipment tracking
```

### Individual Location Pages
```
Location Pages (per pickup/delivery)
├── Location details header
├── Address and appointment information
├── Contact details
├── Goods list specific to location
├── Special instructions
└── Signature areas
```

### Per-Unit Pages
```
Unit Pages (for multiple units)
├── Individual pallet pages
├── Box detail pages
├── Bag specification pages
├── Unit-specific QR codes
└── Handling instructions
```

## Technology Stack Architecture

### Frontend Stack
```
React 19.1.0
├── Modern hooks (useState, useEffect)
├── Component-based architecture
├── Event-driven state updates
└── Controlled component patterns

Tailwind CSS 3.4.17
├── Utility-first CSS framework
├── Custom gradient themes
├── Mobile-first responsive design
└── Component-specific styling
```

### PDF Generation Stack
```
Legacy PDF System
├── jsPDF 2.5.1
├── jsPDF-autotable 3.5.28
├── QRCode 1.5.4
└── JsBarcode 3.12.1

Modern PDF System
├── @react-pdf/renderer 4.3.0
├── Component-based PDF generation
├── Styled PDF components
└── React rendering paradigm
```

### Testing Architecture
```
Testing Framework
├── Jest (from Create React App)
├── React Testing Library 16.3.0
├── @testing-library/jest-dom 6.6.3
└── @testing-library/user-event 13.5.0
```

## Design System Architecture

### Theme Colors
```javascript
// Primary gradient: bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600
THEME_COLORS = {
  primary: {
    blue500: [59, 130, 246],
    blue600: [37, 99, 235],
    purple600: [147, 51, 234]
  },
  // Extended color palette for status indicators
  blue: { 50, 100, 200, 300, 500, 600, 700, 800, 900 },
  emerald: { 100, 200, 500, 600, 700, 800 },
  red: { 500, 600, 700, 800 },
  purple: { 50, 200, 600, 800, 900 },
  orange: { 500, 600, 700, 800 }
}
```

### Component Patterns
```
UI Component Patterns
├── Card-based layouts with rounded corners
├── Gradient backgrounds for headers
├── Shadow elevation for depth
├── Hover states with smooth transitions
├── Mobile-first responsive breakpoints
└── Touch-friendly interactive elements
```

## Data Flow Architecture

### State Update Patterns
```
State Updates (Immutable Patterns)
├── Array updates with spread operators
├── Object updates with nested spreading
├── Index-based location/goods updates
└── Validation on state changes
```

### Event Flow
```
User Interaction Flow
├── Screen-level event handlers
├── State validation and updates
├── Navigation control
├── Cross-screen data persistence
└── PDF generation triggers
```

## Performance Considerations

### Optimization Opportunities
```
Performance Bottlenecks
├── Monolithic component re-renders
├── PDF generation CPU intensity
├── Complex state update patterns
├── Mock data management
└── Validation computation overhead
```

### Scalability Challenges
```
Scalability Issues
├── Single component complexity
├── State management at scale
├── Testing coverage gaps
├── Component reusability
└── Code maintainability
```