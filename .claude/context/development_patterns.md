# Phoenix Prime Shipper - Development Patterns & Conventions

## Code Organization Patterns

### Component Definition Pattern
```javascript
// Screen components follow this structure:
const ScreenNameScreen = ({ onNext, onBack, initialData = {}, ...props }) => {
  const [localState, setLocalState] = useState(initialValue);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Screen Title" onBack={onBack} />
      <ProgressBar currentStep={stepNumber} totalSteps={8} stepNames={stepNames} />
      
      <div className="p-6">
        {/* Screen content */}
      </div>
    </div>
  );
};
```

### State Management Patterns
```javascript
// Immutable state updates for nested objects
setJobData(prev => ({
  ...prev,
  pickups: prev.pickups.map((pickup, index) => 
    index === currentLocationIndex 
      ? { ...pickup, goods: [...pickup.goods, newGood] }
      : pickup
  )
}));

// Array updates with proper spreading
setJobData(prev => ({
  ...prev,
  deliveries: [
    ...prev.deliveries.slice(0, index),
    updatedDelivery,
    ...prev.deliveries.slice(index + 1)
  ]
}));
```

## UI/UX Design Patterns

### Consistent Color Scheme
```javascript
// Primary gradient used throughout app
className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"

// Card styling pattern
className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"

// Button hover effects
className="group hover:from-blue-200 hover:to-blue-300 transition-all"
```

### Layout Patterns
```javascript
// Screen container pattern
<div className="min-h-screen bg-slate-50">
  <Header />
  <ProgressBar />
  <div className="p-6">
    {/* Content with 24px padding */}
  </div>
</div>

// Section header pattern
<div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-xl p-4 text-white shadow-lg mb-6">
  <div className="flex items-center">
    <div className="w-8 h-8 mr-3 flex items-center justify-center">
      {/* Icon */}
    </div>
    <div>
      <h2 className="text-lg font-semibold">Title</h2>
      <p className="text-sm opacity-90">Description</p>
    </div>
  </div>
</div>
```

### Interactive Element Patterns
```javascript
// Selection cards with hover states
<button className="w-full bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
  <div className="flex items-center">
    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg mr-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
      {icon}
    </div>
    <div className="text-left flex-1">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
    <span className="text-slate-400 group-hover:text-blue-500 transition-colors">→</span>
  </div>
</button>
```

## Form Handling Patterns

### Input Field Styling
```javascript
// Standard input field pattern
<input
  type="text"
  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Enter value"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Error state styling
<input
  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
    isValid 
      ? 'border-slate-300 focus:ring-blue-500 focus:border-blue-500' 
      : 'border-red-300 focus:ring-red-500 focus:border-red-500'
  }`}
/>
```

### Validation Patterns
```javascript
// Real-time validation with visual feedback
const [errors, setErrors] = useState({});

const validateField = (field, value) => {
  const newErrors = { ...errors };
  
  switch (field) {
    case 'mobileNumber':
      if (!value || value.length < 10) {
        newErrors[field] = 'Mobile number is required (minimum 10 digits)';
      } else {
        delete newErrors[field];
      }
      break;
    // ... other validations
  }
  
  setErrors(newErrors);
};

// Error display pattern
{errors.fieldName && (
  <p className="text-red-500 text-sm mt-1">{errors.fieldName}</p>
)}
```

### Modal Patterns
```javascript
// Modal overlay and positioning
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Modal Title</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
```

## Navigation & Flow Control Patterns

### Step Navigation Pattern
```javascript
// Navigation function pattern
const handleNext = (data = {}) => {
  // Update state with new data
  setJobData(prev => ({ ...prev, ...data }));
  
  // Conditional navigation based on job type
  if (currentStep === 2 && jobData.type === 'single') {
    setCurrentStep(3); // Skip location count for single jobs
  } else {
    setCurrentStep(prev => prev + 1);
  }
};

const handleBack = () => {
  // Preserve state when going back
  if (currentStep === 3 && jobData.type === 'single') {
    setCurrentStep(1); // Skip location count when going back
  } else {
    setCurrentStep(prev => prev - 1);
  }
};
```

### Conditional Rendering Patterns
```javascript
// Job type conditional logic
const isMultiJob = jobData.type === 'multi-pickup' || jobData.type === 'multi-drop';
const shouldShowTransferType = jobData.pickups?.some(p => 
  p.goods?.some(g => g.type === 'pallets')
) || jobData.deliveries?.some(d => 
  d.goods?.some(g => g.type === 'pallets')
);

// Conditional step rendering
const renderCurrentScreen = () => {
  switch (currentStep) {
    case 1: return <JobTypeScreen onSelect={handleJobTypeSelect} />;
    case 2: return isMultiJob ? <LocationCountScreen /> : handleNext();
    case 6: return shouldShowTransferType ? <TransferTypeScreen /> : handleNext();
    // ... other cases
  }
};
```

## Data Structure Patterns

### Job Data Structure
```javascript
// Consistent data structure for all job types
const defaultJobData = {
  type: null, // 'single', 'multi-pickup', 'multi-drop'
  locationCount: 2,
  pickups: [
    {
      address: null,
      appointmentType: 'flexible',
      appointmentDate: '',
      appointmentTime: '',
      mobileNumber: '',
      specialInstructions: '',
      goods: []
    }
  ],
  deliveries: [/* similar structure */],
  vehicle: null,
  transferType: null,
  totalWeight: 0,
  totalCost: 0,
  currency: 'AUD'
};
```

### Goods Data Structure
```javascript
// Consistent structure for all packaging types
const goodsStructure = {
  id: string, // unique identifier
  type: 'pallets' | 'boxes' | 'bags' | 'loose',
  
  // Common fields
  quantity: number,
  weight: number,
  description: string,
  
  // Type-specific fields
  // For pallets:
  palletType: 'chep' | 'loscam' | 'plain-wood' | 'custom',
  security: 'none' | 'shrink-wrap' | 'steel-strapping',
  
  // For boxes:
  dimensions: { length: number, width: number, height: number },
  fragile: boolean,
  
  // For bags:
  dimensions: { length: number, width: number, height: number },
  
  // For loose items:
  items: [{ name: string, quantity: number, weight: number }]
};
```

## PDF Generation Patterns

### Theme Color Integration
```javascript
// PDF colors matching UI theme
const THEME_COLORS = {
  primary: {
    blue500: [59, 130, 246],     // Matches Tailwind blue-500
    blue600: [37, 99, 235],      // Matches Tailwind blue-600
    purple600: [147, 51, 234],   // Matches Tailwind purple-600
  }
};

// Color application in PDF
pdf.setFillColor(...THEME_COLORS.primary.blue500);
pdf.setTextColor(...THEME_COLORS.primary.blue600);
```

### PDF Layout Patterns
```javascript
// Consistent page structure
const generatePDFPage = (pdf, pageData) => {
  // Header with gradient background
  addGradientHeader(pdf, pageData.title);
  
  // Content sections with consistent spacing
  let yPosition = 60;
  yPosition = addSection(pdf, 'Section Title', sectionData, yPosition);
  yPosition += 20; // Consistent spacing between sections
  
  // Footer with page numbers and branding
  addFooter(pdf, pageNumber, totalPages);
};
```

## Testing Patterns

### Component Testing Setup
```javascript
// Standard test imports and setup
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock external dependencies
jest.mock('./components/pdf/ReactPDFGenerator', () => ({
  downloadReactPDF: jest.fn()
}));

// Test patterns for multi-step flows
describe('Multi-step booking flow', () => {
  test('should navigate through single job flow', async () => {
    render(<App />);
    
    // Step 1: Select job type
    const singleJobButton = screen.getByText('Single Pickup/Drop');
    fireEvent.click(singleJobButton);
    
    // Should skip to step 3 (location details)
    await waitFor(() => {
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });
  });
});
```

## Error Handling Patterns

### Error Boundary Pattern
```javascript
// Error display with user-friendly messages
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <div className="text-red-600 mr-3">⚠️</div>
      <div>
        <h4 className="text-red-800 font-semibold">Error</h4>
        <p className="text-red-700 text-sm">{error.message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);
```

### Validation Error Patterns
```javascript
// Comprehensive validation with specific error messages
const validateJobData = (jobData) => {
  const errors = {};
  
  // Required field validation
  if (!jobData.type) {
    errors.type = 'Job type is required';
  }
  
  // Business logic validation
  if (jobData.pickups?.length === 0) {
    errors.pickups = 'At least one pickup location is required';
  }
  
  // Cross-field validation
  if (jobData.totalWeight > selectedVehicle?.capacity) {
    errors.vehicle = 'Selected vehicle cannot handle the total weight';
  }
  
  return errors;
};
```

## Performance Optimization Patterns

### Memoization Patterns
```javascript
// Memoize expensive calculations
const totalWeight = useMemo(() => {
  return jobData.pickups?.reduce((total, pickup) => 
    total + pickup.goods?.reduce((goodsTotal, good) => 
      goodsTotal + (good.weight * good.quantity), 0
    ), 0
  ) || 0;
}, [jobData.pickups]);

// Memoize complex components
const MemoizedGoodsDetailsScreen = memo(GoodsDetailsScreen);
```

### Callback Optimization
```javascript
// Stable callback references
const handleLocationUpdate = useCallback((index, updatedLocation) => {
  setJobData(prev => ({
    ...prev,
    pickups: prev.pickups.map((pickup, i) => 
      i === index ? { ...pickup, ...updatedLocation } : pickup
    )
  }));
}, []);
```

## Common Utility Patterns

### Currency Formatting
```javascript
const formatCurrency = (amount, currency = 'AUD') => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
```

### Date/Time Formatting
```javascript
const formatAppointmentTime = (date, time) => {
  if (!date || !time) return 'Flexible timing';
  return `${new Date(date).toLocaleDateString()} at ${time}`;
};
```

### Weight Calculations
```javascript
const calculateGoodsWeight = (goods) => {
  return goods.reduce((total, good) => {
    return total + (good.weight * good.quantity);
  }, 0);
};
```

These patterns ensure consistency across the application and provide a foundation for future development and refactoring efforts.