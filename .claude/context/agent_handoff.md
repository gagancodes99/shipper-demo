# Phoenix Prime Shipper - Quick Agent Handoff

## Project Overview
Phoenix Prime Shipper is a production-ready React shipping/logistics application with an 8-step multi-step booking flow. It supports complex shipping scenarios including single pickup/drop, multi-pickup, and multi-drop operations with sophisticated packaging management and professional PDF documentation.

## Key Technical Details
- **React 19.1.0** with modern hooks and centralized state management
- **Monolithic Architecture**: App.js (3,787 lines) contains all screens and business logic
- **Advanced PDF Generation**: PDFGenerator.js (1,719 lines) + React PDF components with theme matching
- **Mobile-First Design**: Tailwind CSS 3.4.17 with custom gradient themes
- **Professional Testing**: Jest + React Testing Library setup (needs enhancement)

## Critical Architecture Points

### State Management Pattern
- Centralized state in main App component with complex nested objects
- `jobData` - Main job configuration with pickups, deliveries, goods, vehicle data
- `currentStep` - Navigation state for 8-step flow control
- Location/goods index synchronization for multi-location workflows

### 8-Step Booking Flow
1. Job Type Selection (single/multi-pickup/multi-drop)
2. Location Count (with packaging validation)
3. Location & Goods Details (address + detailed packaging)
4. Vehicle Selection (with capacity validation)
5. Transfer Type (conditional for pallet jobs)
6. Review (comprehensive summary)
7. Payment (processing interface)
8. Confirmation (PDF generation & download)

### Job Type Logic
- **Single Job**: 1 pickup → 1 delivery
- **Multi-Pickup**: N pickups → 1 delivery (delivery first, then pickups)
- **Multi-Drop**: 1 pickup → N deliveries (pickup first, then deliveries)

### Advanced Packaging System
- **Pallets**: CHEP, LOSCAM, Plain Wood, Custom with security options
- **Boxes**: Weight, dimensions, fragile handling
- **Bags**: Bulk packaging with dimensions
- **Loose Items**: Individual item management
- **Validation Rules**: Location count affects available packaging types

## Development Priorities

### Immediate Refactoring Opportunities
1. **Component Separation**: Break monolithic App.js into focused screen components
2. **State Management**: Consider Context API or reducer pattern for complex state
3. **Test Coverage**: Enhance testing for multi-step form flows and validation logic
4. **Type Safety**: Add PropTypes or TypeScript for better development experience

### Performance Considerations
- PDF generation is CPU intensive - consider web workers for large jobs
- Address book and mock data could benefit from proper state management
- Location/goods index synchronization needs careful handling

### Code Quality
- Excellent gradient theming and responsive design patterns
- Professional PDF generation with QR codes and barcodes
- Complex validation logic but needs better error boundaries
- Good separation of concerns between PDF generation and UI logic

## Key Files to Understand
- `src/App.js` - Main application logic and all screen components
- `src/PDFGenerator.js` - Legacy PDF generation system
- `src/components/pdf/ReactPDFGenerator.js` - Modern React PDF system
- `CLAUDE.md` - Comprehensive project documentation and patterns
- `tailwind.config.js` - Theme configuration

## Development Commands
- `npm start` - Development server (localhost:3000)
- `npm test` - Interactive test runner
- `npm run build` - Production build
- `npm test -- --coverage` - Test coverage report

## Current State
The application is production-ready with a sophisticated booking flow, but the monolithic architecture presents maintainability challenges. The PDF generation system has both legacy (jsPDF) and modern (React PDF) implementations. Testing coverage is minimal and needs enhancement for the complex multi-step workflows.