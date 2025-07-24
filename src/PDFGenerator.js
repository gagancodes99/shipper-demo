import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

// Exact app theme colors matching screen designs
const THEME_COLORS = {
  // Primary brand gradient: bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600
  primary: {
    blue500: [59, 130, 246],     // blue-500
    blue600: [37, 99, 235],      // blue-600
    purple600: [147, 51, 234],   // purple-600
  },
  // Secondary gradients
  blue: {
    50: [240, 249, 255],         // blue-50
    100: [219, 234, 254],        // blue-100
    200: [191, 219, 254],        // blue-200
    300: [147, 197, 253],        // blue-300
    500: [59, 130, 246],         // blue-500
    600: [37, 99, 235],          // blue-600
    700: [29, 78, 216],          // blue-700
    800: [30, 64, 175],          // blue-800
    900: [30, 58, 138],          // blue-900
  },
  emerald: {
    100: [209, 250, 229],        // emerald-100
    200: [167, 243, 208],        // emerald-200
    500: [16, 185, 129],         // emerald-500
    600: [5, 150, 105],          // emerald-600
    700: [4, 120, 87],           // emerald-700
    800: [6, 95, 70],            // emerald-800
  },
  red: {
    500: [239, 68, 68],          // red-500
    600: [220, 38, 127],         // red-600
    700: [185, 28, 28],          // red-700
    800: [153, 27, 27],          // red-800
  },
  purple: {
    50: [250, 245, 255],         // purple-50
    200: [221, 214, 254],        // purple-200
    600: [147, 51, 234],         // purple-600
    800: [109, 40, 217],         // purple-800
    900: [88, 28, 135],          // purple-900
  },
  orange: {
    500: [249, 115, 22],         // orange-500
    600: [234, 88, 12],          // orange-600
    700: [194, 65, 12],          // orange-700
  },
  slate: {
    50: [248, 250, 252],         // slate-50
    100: [241, 245, 249],        // slate-100
    200: [226, 232, 240],        // slate-200
    300: [203, 213, 225],        // slate-300
    400: [148, 163, 184],        // slate-400
    500: [100, 116, 139],        // slate-500
    600: [71, 85, 105],          // slate-600
    700: [51, 65, 85],           // slate-700
    800: [30, 41, 59],           // slate-800
    900: [15, 23, 42],           // slate-900
  },
  amber: {
    50: [255, 251, 235],         // amber-50
    100: [254, 243, 199],        // amber-100
    200: [253, 230, 138],        // amber-200
    800: [146, 64, 14],          // amber-800
  },
  cyan: {
    50: [236, 254, 255],         // cyan-50
    100: [207, 250, 254],        // cyan-100
    200: [165, 243, 252],        // cyan-200
    500: [6, 182, 212],          // cyan-500
    600: [8, 145, 178],          // cyan-600
  },
  indigo: {
    50: [238, 242, 255],         // indigo-50
  },
  white: [255, 255, 255],       // white
};

// Layout constants for consistent spacing
const LAYOUT_CONSTANTS = {
  pageMargin: 10,
  cardPadding: 5,
  rowHeight: 6,
  gridGap: 4,
  sectionSpacing: 15,
  headerSpacing: 12,
  fontSize: {
    small: 6,
    normal: 7,
    medium: 8,
    large: 9,
    title: 10
  }
};

// Grid layout utility functions
const createGrid = (doc, startX, startY, totalWidth, cols, rows, cellHeight = 12) => {
  const cellWidth = (totalWidth - (cols - 1) * LAYOUT_CONSTANTS.gridGap) / cols;
  const grid = [];
  
  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (cellWidth + LAYOUT_CONSTANTS.gridGap);
      const y = startY + row * (cellHeight + LAYOUT_CONSTANTS.gridGap);
      grid[row][col] = {
        x,
        y,
        width: cellWidth,
        height: cellHeight,
        centerX: x + cellWidth / 2,
        centerY: y + cellHeight / 2
      };
    }
  }
  return grid;
};

const drawGridCell = (doc, cell, backgroundColor, borderColor, borderWidth = 1) => {
  // Fill background
  if (backgroundColor) {
    doc.setFillColor(...backgroundColor);
    doc.rect(cell.x, cell.y, cell.width, cell.height, 'F');
  }
  
  // Draw border
  if (borderColor) {
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(borderWidth);
    doc.rect(cell.x, cell.y, cell.width, cell.height, 'S');
  }
};

const addTextToCell = (doc, cell, labelText, valueText, labelColor, valueColor, fontSize = LAYOUT_CONSTANTS.fontSize.normal) => {
  // Label (smaller, top-left)
  doc.setFontSize(fontSize - 1);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...labelColor);
  doc.text(labelText, cell.x + 2, cell.y + 4);
  
  // Value (larger, centered)
  doc.setFontSize(fontSize + 1);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...valueColor);
  const textWidth = doc.getTextWidth(valueText);
  const textX = cell.centerX - textWidth / 2;
  doc.text(valueText, textX, cell.y + 8);
};

// Table utility functions
const calculateOptimalColumnWidths = (data, headers, totalWidth, minWidths = {}) => {
  const numCols = headers.length;
  const padding = 4; // padding per column
  const availableWidth = totalWidth - (numCols * padding);
  
  // Calculate content-based widths
  const contentWidths = headers.map((header, colIndex) => {
    let maxWidth = header.length * 1.2; // Header width estimate
    
    data.forEach(row => {
      if (row[colIndex]) {
        const contentWidth = row[colIndex].toString().length * 1.2;
        maxWidth = Math.max(maxWidth, contentWidth);
      }
    });
    
    return Math.max(maxWidth, minWidths[colIndex] || 15);
  });
  
  // Calculate total and scale to fit
  const totalContentWidth = contentWidths.reduce((sum, width) => sum + width, 0);
  const scaleFactor = availableWidth / totalContentWidth;
  
  return contentWidths.map(width => width * scaleFactor);
};

// Utility functions for data formatting
const formatAddress = (address) => {
  if (!address) return 'No address provided';
  return `${address.address}, ${address.suburb} ${address.postcode}`;
};

const getJobTypeLabel = (jobType) => {
  const labels = {
    'single': 'Single Pickup/Drop',
    'multi-pickup': 'Multi-Pickup',
    'multi-drop': 'Multi-Drop'
  };
  return labels[jobType] || jobType;
};

const formatDetailedPackaging = (packagingTypes) => {
  if (!packagingTypes) return 'No packaging specified';
  
  const details = [];
  
  // Pallets with detailed breakdown
  if (packagingTypes.pallets?.selected) {
    const count = packagingTypes.pallets.quantity || 'Not specified';
    const weight = packagingTypes.pallets.weight ? `${packagingTypes.pallets.weight}kg` : 'Weight not specified';
    const secured = packagingTypes.pallets.secured ? 'Secured' : 'Unsecured';
    
    let palletBreakdown = `Pallets: ${count} (${weight}) - ${secured}`;
    
    // Add pallet type breakdown if available
    if (packagingTypes.pallets.palletTypes) {
      const types = [];
      const pt = packagingTypes.pallets.palletTypes;
      if (pt.CHEP) types.push(`CHEP: ${pt.CHEP}`);
      if (pt.LOSCAM) types.push(`LOSCAM: ${pt.LOSCAM}`);
      if (pt.Plain) types.push(`Plain Wood: ${pt.Plain}`);
      if (pt.Other) types.push(`Other: ${pt.Other}`);
      if (types.length > 0) {
        palletBreakdown += `\n  Types: ${types.join(', ')}`;
      }
      if (pt.otherDimensions) {
        palletBreakdown += `\n  Other Dimensions: ${pt.otherDimensions}`;
      }
    }
    
    details.push(palletBreakdown);
  }
  
  // Boxes with dimensions
  if (packagingTypes.boxes?.selected) {
    const count = packagingTypes.boxes.quantity || 'Not specified';
    const weight = packagingTypes.boxes.weight ? `${packagingTypes.boxes.weight}kg` : 'Weight not specified';
    const dimensions = packagingTypes.boxes.dimensions || 'Dimensions not specified';
    details.push(`Boxes: ${count} (${weight})\n  Dimensions: ${dimensions}`);
  }
  
  // Bags with dimensions
  if (packagingTypes.bags?.selected) {
    const count = packagingTypes.bags.quantity || 'Not specified';
    const weight = packagingTypes.bags.weight ? `${packagingTypes.bags.weight}kg` : 'Weight not specified';
    const dimensions = packagingTypes.bags.dimensions || 'Dimensions not specified';
    details.push(`Bags: ${count} (${weight})\n  Dimensions: ${dimensions}`);
  }
  
  // Loose items with dimensions
  if (packagingTypes.others?.selected) {
    const count = packagingTypes.others.quantity || 'Not specified';
    const weight = packagingTypes.others.weight ? `${packagingTypes.others.weight}kg` : 'Weight not specified';
    const dimensions = packagingTypes.others.dimensions || 'Dimensions not specified';
    details.push(`Loose Items: ${count} (${weight})\n  Dimensions: ${dimensions}`);
  }
  
  return details.length > 0 ? details.join('\n\n') : 'No packaging specified';
};

const formatVehicleDetails = (vehicle, truckBodyType, isRefrigerated) => {
  if (!vehicle) return 'No vehicle specified';
  
  let details = `${vehicle.name} (${vehicle.capacity})`;
  if (vehicle.pallets) details += `\nPallet Capacity: ${vehicle.pallets}`;
  if (vehicle.maxWeight) details += `\nMax Weight: ${vehicle.maxWeight} tonnes`;
  if (truckBodyType) details += `\nBody Type: ${truckBodyType}`;
  if (isRefrigerated) details += `\nRefrigerated: Yes`;
  
  return details;
};

const calculateTotalWeight = (goodsArray) => {
  if (!goodsArray || goodsArray.length === 0) return 0;
  
  return goodsArray.reduce((total, goods) => {
    if (!goods?.packagingTypes) return total;
    
    const pt = goods.packagingTypes;
    let weight = 0;
    
    if (pt.pallets?.selected && pt.pallets.weight) weight += pt.pallets.weight;
    if (pt.boxes?.selected && pt.boxes.weight) weight += pt.boxes.weight;
    if (pt.bags?.selected && pt.bags.weight) weight += pt.bags.weight;
    if (pt.others?.selected && pt.others.weight) weight += pt.others.weight;
    
    return total + weight;
  }, 0);
};

const calculateTotalItems = (goodsArray) => {
  if (!goodsArray || goodsArray.length === 0) return 0;
  
  return goodsArray.reduce((total, goods) => {
    if (!goods?.packagingTypes) return total;
    
    const pt = goods.packagingTypes;
    let count = 0;
    
    if (pt.pallets?.selected && pt.pallets.quantity) count += pt.pallets.quantity;
    if (pt.boxes?.selected && pt.boxes.quantity) count += pt.boxes.quantity;
    if (pt.bags?.selected && pt.bags.quantity) count += pt.bags.quantity;
    if (pt.others?.selected && pt.others.quantity) count += pt.others.quantity;
    
    return total + count;
  }, 0);
};

const generateQRCodeDataURL = async (data) => {
  try {
    return await QRCode.toDataURL(data, { width: 80, margin: 1 });
  } catch (err) {
    console.error('QR Code generation error:', err);
    return null;
  }
};

const generateBarcodeDataURL = (data) => {
  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, data, { 
      format: "CODE128",
      width: 2,
      height: 40,
      displayValue: false
    });
    return canvas.toDataURL();
  } catch (err) {
    console.error('Barcode generation error:', err);
    return null;
  }
};

// Card component helper - no background, transparent
const drawCard = (doc, x, y, width, height, fillColor = THEME_COLORS.white, borderColor = THEME_COLORS.slate[200], cornerRadius = 3) => {
  // No background drawing - completely transparent
};

// Gradient background helper matching app screens
const drawGradientBackground = (doc, x, y, width, height, colors) => {
  const steps = 20;
  const stepHeight = height / steps;
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(colors[0][0] + (colors[1][0] - colors[0][0]) * ratio);
    const g = Math.round(colors[0][1] + (colors[1][1] - colors[0][1]) * ratio);
    const b = Math.round(colors[0][2] + (colors[1][2] - colors[0][2]) * ratio);
    
    doc.setFillColor(r, g, b);
    doc.rect(x, y + i * stepHeight, width, stepHeight + 1, 'F');
  }
};

// Three-color gradient helper for primary brand gradient
const drawTripleGradient = (doc, x, y, width, height, color1, color2, color3) => {
  const steps = 30;
  const stepWidth = width / steps;
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    let r, g, b;
    
    if (ratio <= 0.5) {
      const localRatio = ratio * 2;
      r = Math.round(color1[0] + (color2[0] - color1[0]) * localRatio);
      g = Math.round(color1[1] + (color2[1] - color1[1]) * localRatio);
      b = Math.round(color1[2] + (color2[2] - color1[2]) * localRatio);
    } else {
      const localRatio = (ratio - 0.5) * 2;
      r = Math.round(color2[0] + (color3[0] - color2[0]) * localRatio);
      g = Math.round(color2[1] + (color3[1] - color2[1]) * localRatio);
      b = Math.round(color2[2] + (color3[2] - color2[2]) * localRatio);
    }
    
    doc.setFillColor(r, g, b);
    doc.rect(x + i * stepWidth, y, stepWidth + 1, height, 'F');
  }
};

// Compact section header
const drawSectionHeader = (doc, x, y, width, height, title, subtitle = '', isPickup = false, isDelivery = false) => {
  if (isPickup) {
    drawGradientBackground(doc, x, y, width, height, [THEME_COLORS.emerald[500], THEME_COLORS.emerald[600]]);
  } else if (isDelivery) {
    drawGradientBackground(doc, x, y, width, height, [THEME_COLORS.red[500], THEME_COLORS.red[600]]);
  } else {
    drawTripleGradient(doc, x, y, width, height, THEME_COLORS.primary.blue500, THEME_COLORS.primary.blue600, THEME_COLORS.primary.purple600);
  }
  
  // Ultra compact text - reduced by 50%
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + 5, y + height / 2 - 0.5);
  
  if (subtitle) {
    doc.setFontSize(3);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, x + 5, y + height / 2 + 1.5);
  }
};

// Main PDF generation function
export const generateBookingPDF = async (jobData, jobId, otp) => {
  const doc = new jsPDF();
  
  // Generate barcodes and QR codes
  const barcodeDataURL = generateBarcodeDataURL(jobId);
  
  // Generate summary page
  await generateSummaryPage(doc, jobData, jobId, otp, barcodeDataURL);
  
  // Generate pickup pages
  if (jobData.pickups && jobData.pickups.length > 0) {
    for (let i = 0; i < jobData.pickups.length; i++) {
      doc.addPage();
      await generatePickupPage(doc, jobData.pickups[i], i, jobData, jobId);
    }
  }
  
  // Generate delivery pages - multiple pages per location based on all packaging types
  if (jobData.deliveries && jobData.deliveries.length > 0) {
    for (let i = 0; i < jobData.deliveries.length; i++) {
      const delivery = jobData.deliveries[i];
      const goods = jobData.deliveryGoods?.[i];
      
      // Generate packaging units array for this delivery
      const packagingUnits = [];
      
      if (goods?.packagingTypes) {
        const packagingTypes = {
          pallets: 'Pallet',
          boxes: 'Box',
          bags: 'Bag',
          others: 'Loose Item'
        };
        
        Object.entries(packagingTypes).forEach(([type, label]) => {
          const pkg = goods.packagingTypes[type];
          if (pkg && pkg.selected && pkg.quantity) {
            for (let unitIndex = 0; unitIndex < pkg.quantity; unitIndex++) {
              packagingUnits.push({
                type: type,
                label: label,
                unitIndex: unitIndex + 1,
                totalUnits: pkg.quantity,
                packageData: pkg
              });
            }
          }
        });
      }
      
      // If no packaging units, create one default page
      if (packagingUnits.length === 0) {
        packagingUnits.push({
          type: 'delivery',
          label: 'Delivery',
          unitIndex: 1,
          totalUnits: 1,
          packageData: null
        });
      }
      
      // Generate one page per packaging unit
      for (let unitIdx = 0; unitIdx < packagingUnits.length; unitIdx++) {
        doc.addPage();
        await generateDeliveryPage(doc, delivery, i, jobData, jobId, packagingUnits[unitIdx], packagingUnits.length);
      }
    }
  }
  
  return doc;
};

// Generate compact master documentation page
const generateSummaryPage = async (doc, jobData, jobId, otp, barcodeDataURL) => {
    const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Main background
  doc.setFillColor(...THEME_COLORS.slate[50]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Ultra compact header - reduced by 50% from 18px to 9px
  drawTripleGradient(doc, 0, 0, pageWidth, 9, THEME_COLORS.primary.blue500, THEME_COLORS.primary.blue600, THEME_COLORS.primary.purple600);
  
  // Compact header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.text('PHOENIX PRIME SHIPPER - MASTER DOCUMENTATION', 10, 7);
  
  let yPos = 15;
  
  // Booking Confirmed Section - matching app design
  drawCard(doc, 10, yPos, pageWidth - 20, 25, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  
  // Booking status indicator
  doc.setFontSize(8);
  doc.setTextColor(...THEME_COLORS.emerald[600]);
  doc.text('CONFIRMED', pageWidth/2 - 8, yPos + 8);
  
  // Booking Confirmed text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('Booking Confirmed', pageWidth/2 - 12, yPos + 15);
  
  // Booking details subtitle
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text('Your shipping request has been confirmed', pageWidth/2 - 25, yPos + 20);
  
  yPos += 15;
  
  // Master Documentation Card
  const masterCardHeight = 35;
  drawCard(doc, LAYOUT_CONSTANTS.pageMargin, yPos, pageWidth - 2 * LAYOUT_CONSTANTS.pageMargin, masterCardHeight, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 3;
  
  // Master Documentation header
  doc.setFontSize(LAYOUT_CONSTANTS.fontSize.small);
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text('DOC', 15, yPos + 8);
  
  // Master Documentation title
  doc.setFontSize(LAYOUT_CONSTANTS.fontSize.medium);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('Master Documentation', 25, yPos + 8);
  
  // Job reference subtitle
  doc.setFontSize(LAYOUT_CONSTANTS.fontSize.small);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text('Job reference and details', 25, yPos + 12);
  
  // Job details in 2x2 grid format
  yPos += LAYOUT_CONSTANTS.headerSpacing;
  
  const gridStartX = 15;
  const gridWidth = pageWidth - 30;
  const grid = createGrid(doc, gridStartX, yPos, gridWidth, 2, 2, 10);
  
  // Job ID (top-left)
  drawGridCell(doc, grid[0][0], THEME_COLORS.slate[50], THEME_COLORS.slate[200], 0.5);
  addTextToCell(doc, grid[0][0], 'Job ID:', jobId, THEME_COLORS.slate[500], THEME_COLORS.purple[600], LAYOUT_CONSTANTS.fontSize.normal);
  
  // OTP (top-right)
  drawGridCell(doc, grid[0][1], THEME_COLORS.blue[50], THEME_COLORS.blue[200], 0.5);
  addTextToCell(doc, grid[0][1], 'OTP:', otp.toString(), THEME_COLORS.slate[500], THEME_COLORS.blue[600], LAYOUT_CONSTANTS.fontSize.normal);
  
  // Status (bottom-left)
  drawGridCell(doc, grid[1][0], THEME_COLORS.emerald[100], THEME_COLORS.emerald[200], 0.5);
  addTextToCell(doc, grid[1][0], 'Status:', 'Confirmed', THEME_COLORS.slate[500], THEME_COLORS.emerald[600], LAYOUT_CONSTANTS.fontSize.normal);
  
  // Job Type (bottom-right)
  drawGridCell(doc, grid[1][1], THEME_COLORS.purple[50], THEME_COLORS.purple[200], 0.5);
  addTextToCell(doc, grid[1][1], 'Type:', getJobTypeLabel(jobData.jobType), THEME_COLORS.slate[500], THEME_COLORS.purple[600], LAYOUT_CONSTANTS.fontSize.normal);
  
  yPos += 22; // Account for grid height + spacing
  
  // Vehicle & Service Information Card - tabular format
  const vehicleCardHeight = 40;
  drawCard(doc, LAYOUT_CONSTANTS.pageMargin, yPos, pageWidth - 2 * LAYOUT_CONSTANTS.pageMargin, vehicleCardHeight, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 3;
  
  // Vehicle header
  doc.setFontSize(LAYOUT_CONSTANTS.fontSize.small);
  doc.setTextColor(...THEME_COLORS.purple[600]);
  doc.text('VEHICLE', 15, yPos + 8);
  
  // Vehicle & Service title
  doc.setFontSize(LAYOUT_CONSTANTS.fontSize.medium);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.purple[800]);
  doc.text('Vehicle & Service', 25, yPos + 8);
  
  // Transportation details subtitle
  doc.setFontSize(LAYOUT_CONSTANTS.fontSize.small);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.purple[600]);
  doc.text('Transportation details', 25, yPos + 12);
  
  // Vehicle details in 2x3 grid format
  yPos += LAYOUT_CONSTANTS.headerSpacing;
  
  const vehicle = jobData.vehicle || {};
  const vehicleGridStartX = 15;
  const vehicleGridWidth = pageWidth - 30;
  const vehicleGrid = createGrid(doc, vehicleGridStartX, yPos, vehicleGridWidth, 2, 3, 8);
  
  // Row 1: Vehicle and Capacity
  drawGridCell(doc, vehicleGrid[0][0], THEME_COLORS.orange[50], THEME_COLORS.orange[200], 0.5);
  addTextToCell(doc, vehicleGrid[0][0], 'Vehicle:', vehicle.name || 'Van (1T)', THEME_COLORS.slate[500], THEME_COLORS.orange[600], LAYOUT_CONSTANTS.fontSize.small);
  
  drawGridCell(doc, vehicleGrid[0][1], THEME_COLORS.cyan[50], THEME_COLORS.cyan[200], 0.5);
  addTextToCell(doc, vehicleGrid[0][1], 'Capacity:', vehicle.capacity || '1 Tonne', THEME_COLORS.slate[500], THEME_COLORS.cyan[600], LAYOUT_CONSTANTS.fontSize.small);
  
  // Row 2: Max Weight and Pallet Capacity
  drawGridCell(doc, vehicleGrid[1][0], THEME_COLORS.slate[50], THEME_COLORS.slate[200], 0.5);
  addTextToCell(doc, vehicleGrid[1][0], 'Max Weight:', `${vehicle.maxWeight || '1'} tonnes`, THEME_COLORS.slate[500], THEME_COLORS.cyan[600], LAYOUT_CONSTANTS.fontSize.small);
  
  drawGridCell(doc, vehicleGrid[1][1], THEME_COLORS.cyan[50], THEME_COLORS.cyan[200], 0.5);
  addTextToCell(doc, vehicleGrid[1][1], 'Pallet Capacity:', `${vehicle.pallets || '2'} Pallets`, THEME_COLORS.slate[500], THEME_COLORS.cyan[600], LAYOUT_CONSTANTS.fontSize.small);
  
  // Row 3: Body Type and Refrigeration
  drawGridCell(doc, vehicleGrid[2][0], THEME_COLORS.purple[50], THEME_COLORS.purple[200], 0.5);
  addTextToCell(doc, vehicleGrid[2][0], 'Body Type:', jobData.truckBodyType || 'Pantech', THEME_COLORS.slate[500], THEME_COLORS.purple[600], LAYOUT_CONSTANTS.fontSize.small);
  
  const refrigerationStatus = jobData.isRefrigerated ? 'Required' : 'Not Required';
  const refrigerationColor = jobData.isRefrigerated ? THEME_COLORS.emerald[600] : THEME_COLORS.slate[400];
  drawGridCell(doc, vehicleGrid[2][1], THEME_COLORS.slate[50], THEME_COLORS.slate[200], 0.5);
  addTextToCell(doc, vehicleGrid[2][1], 'Refrigeration:', refrigerationStatus, THEME_COLORS.slate[500], refrigerationColor, LAYOUT_CONSTANTS.fontSize.small);
  
  yPos += 28; // Account for 3 rows of grid height + spacing

  // Rest of the function remains the same...
  // [Previous code for pickup locations, delivery locations, shipment totals, etc.]
  
  // Comprehensive Pickup Locations with Full Details
  if (jobData.pickups && jobData.pickups.length > 0) {
    yPos += LAYOUT_CONSTANTS.sectionSpacing;
    const pickupCardHeight = 20 + (jobData.pickups.length * 16);
    drawCard(doc, LAYOUT_CONSTANTS.cardPadding, yPos, pageWidth - 2 * LAYOUT_CONSTANTS.cardPadding, pickupCardHeight, THEME_COLORS.emerald[100], THEME_COLORS.emerald[200], 2);
    yPos += 3;
    
    doc.setFontSize(LAYOUT_CONSTANTS.fontSize.large);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.emerald[800]);
    doc.text('PICKUP LOCATIONS', LAYOUT_CONSTANTS.pageMargin, yPos);
    yPos += LAYOUT_CONSTANTS.rowHeight;
    
    // Create pickup locations table
    const pickupTableData = [];
    
    jobData.pickups.forEach((pickup, index) => {
      const goods = jobData.pickupGoods?.[index];
      
      // Create compact packaging summary
      let packagingSummary = 'No packaging';
      if (goods?.packagingTypes) {
        const packagingItems = [];
        const pt = goods.packagingTypes;
        if (pt?.pallets?.selected) packagingItems.push(`${pt.pallets.quantity || 0} Pallets (${pt.pallets.weight || 0}kg)`);
        if (pt?.boxes?.selected) packagingItems.push(`${pt.boxes.quantity || 0} Boxes (${pt.boxes.weight || 0}kg)`);
        if (pt?.bags?.selected) packagingItems.push(`${pt.bags.quantity || 0} Bags (${pt.bags.weight || 0}kg)`);
        if (pt?.others?.selected) packagingItems.push(`${pt.others.quantity || 0} Items (${pt.others.weight || 0}kg)`);
        
        if (packagingItems.length > 0) {
          packagingSummary = packagingItems.join(', ');
        }
      }
      
      pickupTableData.push([
        `${index + 1}. ${pickup.customerName || 'N/A'}`,
        formatAddress(pickup.address),
        `${pickup.date || 'N/A'} at ${pickup.time || 'N/A'}`,
        pickup.recipientMobile || 'N/A',
        goods?.description || 'N/A',
        packagingSummary,
        pickup.instructions || ''
      ]);
    });

    // Calculate optimal column widths for pickup table
    const pickupHeaders = ['Customer', 'Address', 'Schedule', 'Contact', 'Goods', 'Packaging', 'Instructions'];
    const pickupMinWidths = { 0: 20, 1: 30, 2: 22, 3: 18, 4: 20, 5: 30, 6: 20 };
    const pickupTableWidth = pageWidth - 16; // Account for margins
    const pickupColumnWidths = calculateOptimalColumnWidths(pickupTableData, pickupHeaders, pickupTableWidth, pickupMinWidths);
    
    const pickupColumnStyles = {};
    pickupColumnWidths.forEach((width, index) => {
      pickupColumnStyles[index] = { cellWidth: width };
    });

    doc.autoTable({
      startY: yPos,
      head: [pickupHeaders],
      body: pickupTableData,
      margin: { left: 8, right: 8 },
      styles: {
        fontSize: LAYOUT_CONSTANTS.fontSize.small,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
        textColor: [71, 85, 105], // slate-600
        halign: 'left',
        valign: 'top',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [167, 243, 208], // emerald-200
        textColor: [6, 95, 70], // emerald-800
        fontStyle: 'bold',
        fontSize: LAYOUT_CONSTANTS.fontSize.normal,
        halign: 'center'
      },
      columnStyles: pickupColumnStyles
    });
    
    yPos = doc.lastAutoTable.finalY + LAYOUT_CONSTANTS.sectionSpacing;
  }
  
  // Comprehensive Delivery Locations with Full Details
  if (jobData.deliveries && jobData.deliveries.length > 0) {
    yPos += LAYOUT_CONSTANTS.sectionSpacing;
    const deliveryCardHeight = 20 + (jobData.deliveries.length * 16);
    drawCard(doc, LAYOUT_CONSTANTS.cardPadding, yPos, pageWidth - 2 * LAYOUT_CONSTANTS.cardPadding, deliveryCardHeight, THEME_COLORS.red[100], THEME_COLORS.red[200], 2);
    yPos += 3;
    
    doc.setFontSize(LAYOUT_CONSTANTS.fontSize.large);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.red[800]);
    doc.text('DELIVERY LOCATIONS', LAYOUT_CONSTANTS.pageMargin, yPos);
    yPos += LAYOUT_CONSTANTS.rowHeight;
    
    // Create delivery locations table
    const deliveryTableData = [];
    
    jobData.deliveries.forEach((delivery, index) => {
      const goods = jobData.deliveryGoods?.[index];
      
      // Create compact packaging summary
      let packagingSummary = 'No packaging';
      if (goods?.packagingTypes) {
        const packagingItems = [];
        const pt = goods.packagingTypes;
        if (pt?.pallets?.selected) packagingItems.push(`${pt.pallets.quantity || 0} Pallets (${pt.pallets.weight || 0}kg)`);
        if (pt?.boxes?.selected) packagingItems.push(`${pt.boxes.quantity || 0} Boxes (${pt.boxes.weight || 0}kg)`);
        if (pt?.bags?.selected) packagingItems.push(`${pt.bags.quantity || 0} Bags (${pt.bags.weight || 0}kg)`);
        if (pt?.others?.selected) packagingItems.push(`${pt.others.quantity || 0} Items (${pt.others.weight || 0}kg)`);
        
        if (packagingItems.length > 0) {
          packagingSummary = packagingItems.join(', ');
        }
      }
      
      deliveryTableData.push([
        `${index + 1}. ${delivery.customerName || 'N/A'}`,
        formatAddress(delivery.address),
        `${delivery.date || 'N/A'} at ${delivery.time || 'N/A'}`,
        delivery.tradingHours || 'N/A',
        goods?.description || 'N/A',
        goods?.deliveryMethod || 'N/A',
        packagingSummary,
        delivery.instructions || ''
      ]);
    });

    // Calculate optimal column widths for delivery table
    const deliveryHeaders = ['Customer', 'Address', 'Schedule', 'Trading Hours', 'Goods', 'Method', 'Packaging', 'Instructions'];
    const deliveryMinWidths = { 0: 20, 1: 28, 2: 20, 3: 16, 4: 18, 5: 16, 6: 28, 7: 18 };
    const deliveryTableWidth = pageWidth - 16; // Account for margins
    const deliveryColumnWidths = calculateOptimalColumnWidths(deliveryTableData, deliveryHeaders, deliveryTableWidth, deliveryMinWidths);
    
    const deliveryColumnStyles = {};
    deliveryColumnWidths.forEach((width, index) => {
      deliveryColumnStyles[index] = { cellWidth: width };
    });

    doc.autoTable({
      startY: yPos,
      head: [deliveryHeaders],
      body: deliveryTableData,
      margin: { left: 8, right: 8 },
      styles: {
        fontSize: LAYOUT_CONSTANTS.fontSize.small,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
        textColor: [71, 85, 105], // slate-600
        halign: 'left',
        valign: 'top',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [251, 146, 60], // red-200 equivalent
        textColor: [153, 27, 27], // red-800
        fontStyle: 'bold',
        fontSize: LAYOUT_CONSTANTS.fontSize.normal,
        halign: 'center'
      },
      columnStyles: deliveryColumnStyles
    });
    
    yPos = doc.lastAutoTable.finalY + LAYOUT_CONSTANTS.sectionSpacing;
  }
  
  // Comprehensive Totals and Calculations
  const totalPickupWeight = jobData.pickupGoods?.reduce((total, goods) => {
    const pt = goods?.packagingTypes;
    if (!pt) return total;
    let weight = 0;
    if (pt.pallets?.selected && pt.pallets.weight) weight += pt.pallets.weight;
    if (pt.boxes?.selected && pt.boxes.weight) weight += pt.boxes.weight;
    if (pt.bags?.selected && pt.bags.weight) weight += pt.bags.weight;
    if (pt.others?.selected && pt.others.weight) weight += pt.others.weight;
    return total + weight;
  }, 0) || 0;
  
  const totalDeliveryWeight = jobData.deliveryGoods?.reduce((total, goods) => {
    const pt = goods?.packagingTypes;
    if (!pt) return total;
    let weight = 0;
    if (pt.pallets?.selected && pt.pallets.weight) weight += pt.pallets.weight;
    if (pt.boxes?.selected && pt.boxes.weight) weight += pt.boxes.weight;
    if (pt.bags?.selected && pt.bags.weight) weight += pt.bags.weight;
    if (pt.others?.selected && pt.others.weight) weight += pt.others.weight;
    return total + weight;
  }, 0) || 0;
  
  const totalPickupItems = jobData.pickupGoods?.reduce((total, goods) => {
    const pt = goods?.packagingTypes;
    if (!pt) return total;
    let count = 0;
    if (pt.pallets?.selected && pt.pallets.quantity) count += pt.pallets.quantity;
    if (pt.boxes?.selected && pt.boxes.quantity) count += pt.boxes.quantity;
    if (pt.bags?.selected && pt.bags.quantity) count += pt.bags.quantity;
    if (pt.others?.selected && pt.others.quantity) count += pt.others.quantity;
    return total + count;
  }, 0) || 0;
  
  const totalDeliveryItems = jobData.deliveryGoods?.reduce((total, goods) => {
    const pt = goods?.packagingTypes;
    if (!pt) return total;
    let count = 0;
    if (pt.pallets?.selected && pt.pallets.quantity) count += pt.pallets.quantity;
    if (pt.boxes?.selected && pt.boxes.quantity) count += pt.boxes.quantity;
    if (pt.bags?.selected && pt.bags.quantity) count += pt.bags.quantity;
    if (pt.others?.selected && pt.others.quantity) count += pt.others.quantity;
    return total + count;
  }, 0) || 0;
  
  drawCard(doc, 5, yPos, pageWidth - 10, 32, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 3;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('SHIPMENT TOTALS & CALCULATIONS', 10, yPos);
  yPos += 6;
  
  // Create shipment totals table
  const totalsTableData = [
    ['Total Weight', `${totalPickupWeight + totalDeliveryWeight}kg`, 'Total Items', `${totalPickupItems + totalDeliveryItems} pieces`],
    ['Total Locations', `${(jobData.pickups?.length || 0) + (jobData.deliveries?.length || 0)}`, 'Job Type', getJobTypeLabel(jobData.jobType)],
    ['Pickup Weight', `${totalPickupWeight}kg`, 'Pickup Items', `${totalPickupItems} pieces`],
    ['Delivery Weight', `${totalDeliveryWeight}kg`, 'Delivery Items', `${totalDeliveryItems} pieces`],
    ['Pickup Locations', `${jobData.pickups?.length || 0}`, 'Delivery Locations', `${jobData.deliveries?.length || 0}`]
  ];

  doc.autoTable({
    startY: yPos,
    body: totalsTableData,
    margin: { left: 8, right: 8 },
    styles: {
      fontSize: 7,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [200, 200, 200],
      textColor: [71, 85, 105], // slate-600
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold', textColor: [51, 65, 85] }, // Field names - slate-700
      1: { cellWidth: 35, textColor: [100, 116, 139] }, // Values - slate-500
      2: { cellWidth: 40, fontStyle: 'bold', textColor: [51, 65, 85] }, // Field names - slate-700
      3: { cellWidth: 35, textColor: [100, 116, 139] }  // Values - slate-500
    },
    // Color code pickup vs delivery rows
    didParseCell: function (data) {
      if (data.row.index === 2) { // Pickup row
        if (data.column.index % 2 === 0) {
          data.cell.styles.textColor = [4, 120, 87]; // emerald-700
        } else {
          data.cell.styles.textColor = [5, 150, 105]; // emerald-600
        }
      } else if (data.row.index === 3) { // Delivery row
        if (data.column.index % 2 === 0) {
          data.cell.styles.textColor = [185, 28, 28]; // red-700
        } else {
          data.cell.styles.textColor = [220, 38, 127]; // red-600
        }
      }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 5;
  
  yPos += 8;
  
  // Compact barcode
if (barcodeDataURL) {
  drawCard(doc, 5, yPos, pageWidth - 10, 18, THEME_COLORS.white, THEME_COLORS.slate[200], 2);

  const barcodeWidth = pageWidth - 16; // 8mm padding on each side
  const barcodeHeight = 11;

  doc.addImage(barcodeDataURL, 'PNG', 8, yPos + 2, barcodeWidth, barcodeHeight);

  doc.setFontSize(6);
  doc.setTextColor(...THEME_COLORS.slate[500]);
  doc.text('Master Tracking Code', 8, yPos + 16);

  yPos += 40; // Adjusted for bottom margin
}

  
  // Add remaining space for footer
  yPos = Math.max(yPos, pageHeight - 8);
  
  // Footer with app branding - reduced height by 50% from 15 to 8px
  drawTripleGradient(doc, 0, pageHeight - 8, pageWidth, 8, THEME_COLORS.primary.blue500, THEME_COLORS.primary.blue600, THEME_COLORS.primary.purple600);
  
  doc.setFontSize(4);
  doc.setTextColor(255, 255, 255);
  doc.text('Generated by Phoenix Prime Shipper', 10, pageHeight - 5);
  doc.setFontSize(3.5);
  doc.text(`Page 1 of ${1 + (jobData.pickups?.length || 0) + (jobData.deliveries?.length || 0)}`, 10, pageHeight - 2);
};

// Generate comprehensive pickup page matching app screens
const generatePickupPage = async (doc, pickup, index, jobData, jobId) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Clean white page background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Ultra compact header - reduced by 50% from 18px to 9px
  const title = jobData.pickups.length > 1 ? `PICKUP LOCATION ${index + 1}` : 'PICKUP LOCATION';
  drawSectionHeader(doc, 0, 0, pageWidth, 9, title, 'Collection Details', true, false);
  
  let yPos = 15;
  
  // Customer & Schedule Information Table
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.emerald[800]);
  doc.text('CUSTOMER & SCHEDULE INFORMATION', 15, yPos);
  yPos += 8;

const customerScheduleData = [
    ['Customer:', pickup.customerName || 'N/A', 'Mobile:', pickup.recipientMobile || 'N/A'],
    ['Address:', formatAddress(pickup.address), '', ''],
    ['Date:', pickup.date || 'N/A', 'Time:', pickup.time || 'N/A'],
    ['Trading Hours:', pickup.tradingHours || 'N/A', '', '']
];

doc.autoTable({
    startY: yPos,
    body: customerScheduleData,
    margin: { left: 15, right: 15 },
    styles: {
        fontSize: 7,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [226, 232, 240], // slate-200 for grid lines
    },
    columnStyles: {
        0: { 
            cellWidth: 30, 
            fontStyle: 'bold', 
            textColor: [101, 116, 139] // slate-600 for field names
        },
        1: { 
            cellWidth: 50, 
            textColor: [71, 85, 105] // slate-700 for values
        },
        2: { 
            cellWidth: 25, 
            fontStyle: 'bold', 
            textColor: [101, 116, 139] // slate-600 for field names
        },
        3: { 
            cellWidth: 50, 
            textColor: [71, 85, 105] // slate-700 for values
        }
    },
    // Custom coloring for specific cells
    didParseCell: function(data) {
        // Highlight customer name
        if (data.row.index === 0 && data.column.index === 1) {
            data.cell.styles.textColor = [79, 70, 229]; // indigo-600
            data.cell.styles.fontStyle = 'bold';
        }
        
        // Highlight mobile number
        if (data.row.index === 0 && data.column.index === 3) {
            data.cell.styles.textColor = [5, 150, 105]; // emerald-600
        }
        
        // Style address differently
        if (data.row.index === 1 && data.column.index === 1) {
            data.cell.styles.textColor = [30, 58, 138]; // blue-800
            data.cell.styles.fontStyle = 'normal';
        }
        
        // Highlight date/time
        if (data.row.index === 2) {
            if (data.column.index === 1) { // Date
                data.cell.styles.textColor = [219, 39, 119]; // pink-600
            }
            if (data.column.index === 3) { // Time
                data.cell.styles.textColor = [234, 88, 12]; // orange-600
            }
        }
        
        // Style trading hours
        if (data.row.index === 3 && data.column.index === 1) {
            data.cell.styles.textColor = [6, 95, 70]; // emerald-800
        }
    }
});
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Compact Instructions Card
  if (pickup.instructions) {
    drawCard(doc, 10, yPos, pageWidth - 20, 20, THEME_COLORS.blue[50], THEME_COLORS.blue[200], 2);
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.blue[800]);
    doc.text('SPECIAL INSTRUCTIONS:', 15, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.blue[900]);
    const instructionLines = doc.splitTextToSize(pickup.instructions, pageWidth - 30);
    doc.text(instructionLines, 15, yPos);
    yPos += instructionLines.length * 4 + 8;
  }
  
  // Compact Appointment Details Card
  if (pickup.appointmentDetails) {
    drawCard(doc, 10, yPos, pageWidth - 20, 20, THEME_COLORS.purple[50], THEME_COLORS.purple[200], 2);
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.purple[800]);
    doc.text('APPOINTMENT DETAILS:', 15, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.purple[900]);
    const appointmentLines = doc.splitTextToSize(pickup.appointmentDetails, pageWidth - 30);
    doc.text(appointmentLines, 15, yPos);
    yPos += appointmentLines.length * 4 + 8;
  }
  
  // Goods Information Section with Tables
  const goods = jobData.pickupGoods?.[index];
  if (goods) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.emerald[800]);
    doc.text('GOODS INFORMATION', 15, yPos);
    yPos += 8;

    // Calculate totals
    const totalWeight = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
    }, 0) : 0;
    const totalItems = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
    }, 0) : 0;

    // Goods summary table
    const goodsSummaryData = [
      ['Description:', goods.description || 'N/A', 'Pickup Method:', goods.pickupMethod || 'N/A'],
      ['Total Weight:', `${totalWeight}kg`, 'Total Items:', `${totalItems} pieces`]
    ];

    doc.autoTable({
      startY: yPos,
      body: goodsSummaryData,
      margin: { left: 15, right: 15 },
      styles: {
        fontSize: 7,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [226, 232, 240],
        textColor: [71, 85, 105],
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold', textColor: [51, 65, 85] },
        1: { cellWidth: 45, textColor: [100, 116, 139] },
        2: { cellWidth: 35, fontStyle: 'bold', textColor: [51, 65, 85] },
        3: { cellWidth: 40, textColor: [100, 116, 139] }
      }
    });

    yPos = doc.lastAutoTable.finalY + 8;

    // Packaging details table
    if (goods.packagingTypes) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.emerald[800]);
      doc.text('PACKAGING DETAILS', 15, yPos);
      yPos += 5;

      const packagingData = [];
      const packagingTypes = ['pallets', 'boxes', 'bags', 'others'];
      const packagingLabels = {
        pallets: 'Pallets',
        boxes: 'Boxes', 
        bags: 'Bags',
        others: 'Loose Items'
      };

      packagingTypes.forEach(type => {
        const pkg = goods.packagingTypes[type];
        if (pkg && pkg.selected) {
          const details = [];
          if (pkg.quantity) details.push(`${pkg.quantity} units`);
          if (pkg.weight) details.push(`${pkg.weight}kg`);
          if (pkg.dimensions) details.push(pkg.dimensions);
          
          const attributes = [];
          if (pkg.secured) attributes.push('Secured');
          if (pkg.fragile) attributes.push('Fragile');
          
          packagingData.push([
            packagingLabels[type],
            details.join(' • '),
            attributes.join(' • ') || 'Standard'
          ]);
        }
      });

      if (packagingData.length > 0) {
        doc.autoTable({
          startY: yPos,
          head: [['Type', 'Details', 'Attributes']],
          body: packagingData,
          margin: { left: 15, right: 15 },
          styles: {
            fontSize: 6,
            cellPadding: 2,
            lineWidth: 0.1,
            lineColor: [226, 232, 240],
            textColor: [71, 85, 105],
          },
          headStyles: {
            fillColor: [167, 243, 208], // emerald-200
            textColor: [6, 95, 70], // emerald-800
            fontStyle: 'bold',
            fontSize: 7,
          },
          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold', textColor: [4, 120, 87] }, // emerald-700
            1: { cellWidth: 70 },
            2: { cellWidth: 40 }
          }
        });
        yPos = doc.lastAutoTable.finalY + 8;
      }
    }

    // Special instructions if any
    if (goods.pickupInstructions) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.blue[800]);
      doc.text('PICKUP INSTRUCTIONS:', 15, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.blue[600]);
      const instructionLines = doc.splitTextToSize(goods.pickupInstructions, pageWidth - 30);
      doc.text(instructionLines, 15, yPos);
      yPos += instructionLines.length * 4 + 8;
    }
  }
  
  // Compact QR Code positioned after content
  try {
    const qrData = JSON.stringify({
      type: 'PICKUP',
      jobId: jobId,
      locationIndex: index + 1,
      customer: pickup.customerName,
      date: pickup.date,
      time: pickup.time
    });
    const qrCodeDataURL = await generateQRCodeDataURL(qrData);
    if (qrCodeDataURL) {
      // Position QR code after content or in available space
      const qrY = Math.max(yPos + 10, pageHeight - 80);
      doc.addImage(qrCodeDataURL, 'PNG', pageWidth - 60, qrY, 50, 50);
      doc.setFontSize(6);
      doc.setTextColor(...THEME_COLORS.slate[500]);
      doc.text('Scan for verification', pageWidth - 60, qrY + 55);
    }
  } catch (error) {
    console.error('QR code generation failed:', error);
  }
  
  // Ultra compact footer with emerald gradient - reduced by 50% from 18 to 9px
  drawGradientBackground(doc, 0, pageHeight - 9, pageWidth, 9, [THEME_COLORS.emerald[500], THEME_COLORS.emerald[600]]);
  doc.setFontSize(3.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Phoenix Prime Shipper - Pickup Documentation', 10, pageHeight - 6);
  doc.setFontSize(3);
  doc.text(`Job ID: ${jobId} | Location ${index + 1}`, 10, pageHeight - 3);
};

// Generate comprehensive delivery page with packaging-based pagination
const generateDeliveryPage = async (doc, delivery, index, jobData, jobId, packagingUnit, totalUnits = 1) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Clean white page background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Ultra compact header - reduced by 50% from 18px to 9px
  const locationTitle = jobData.deliveries.length > 1 ? `DELIVERY LOCATION ${index + 1}` : 'DELIVERY LOCATION';
  const packageTitle = totalUnits > 1 
    ? `${packagingUnit.label.toUpperCase()} ${packagingUnit.unitIndex} OF ${packagingUnit.totalUnits}` 
    : 'DELIVERY DETAILS';
  drawSectionHeader(doc, 0, 0, pageWidth, 9, locationTitle, packageTitle, false, true);
  
  let yPos = 15;
  
  // Packaging Unit Information Section (if multiple units)
  if (totalUnits > 1) {
    drawCard(doc, 10, yPos, pageWidth - 20, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
    yPos += 6;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.red[800]);
    doc.text('PACKAGING UNIT INFORMATION', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(7);
    const leftCol = 20;
    const rightCol = 110;
    const labelWidth = 45;
    
    // Package unit details
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Unit Type:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(packagingUnit.label, leftCol + labelWidth, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Unit Number:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(`${packagingUnit.unitIndex} of ${packagingUnit.totalUnits}`, rightCol + labelWidth, yPos);
    
    yPos += 6;
    
    // Package specific details
    if (packagingUnit.packageData) {
      const pkg = packagingUnit.packageData;
      
      // Weight per unit
      if (pkg.weight) {
        const weightPerUnit = Math.round(pkg.weight / packagingUnit.totalUnits * 100) / 100;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Unit Weight:', leftCol, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(`~${weightPerUnit}kg`, leftCol + labelWidth, yPos);
      }
      
      // Dimensions
      if (pkg.dimensions) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Dimensions:', rightCol, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(pkg.dimensions, rightCol + labelWidth, yPos);
      }
      
      yPos += 6;
      
      // Special attributes
      const attributes = [];
      if (pkg.secured) attributes.push('Secured');
      if (pkg.fragile) attributes.push('Fragile');
      if (pkg.hazardous) attributes.push('Hazardous');
      
      if (attributes.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Special Handling:', leftCol, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.red[600]);
        doc.text(attributes.join(', '), leftCol + labelWidth, yPos);
      }
    }
    
    yPos += 15;
  }
  
  // Customer & Schedule Information Table
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.red[800]);
  doc.text('CUSTOMER & SCHEDULE INFORMATION', 15, yPos);
  yPos += 8;

const customerScheduleData = [
    ['Customer:', delivery.customerName || 'N/A', 'Contact:', delivery.contactNumber || 'N/A'],
    ['Address:', formatAddress(delivery.address), '', ''],
    ['Date:', delivery.date || 'N/A', 'Time:', delivery.time || 'N/A'],
    ['Trading Hours:', delivery.tradingHours || 'N/A', '', '']
];

doc.autoTable({
    startY: yPos,
    body: customerScheduleData,
    margin: { left: 15, right: 15 },
    styles: {
        fontSize: 7,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [226, 232, 240], // slate-200 for grid lines
    },
    columnStyles: {
        0: { 
            cellWidth: 30, 
            fontStyle: 'bold', 
            textColor: [101, 116, 139] // slate-600 for field names
        },
        1: { 
            cellWidth: 50, 
            textColor: [71, 85, 105] // slate-700 for values
        },
        2: { 
            cellWidth: 25, 
            fontStyle: 'bold', 
            textColor: [101, 116, 139] // slate-600 for field names
        },
        3: { 
            cellWidth: 50, 
            textColor: [71, 85, 105] // slate-700 for values
        }
    },
    // Custom coloring for specific cells
    didParseCell: function(data) {
        // Highlight customer name (different from pickup to show distinction)
        if (data.row.index === 0 && data.column.index === 1) {
            data.cell.styles.textColor = [124, 58, 237]; // violet-600
            data.cell.styles.fontStyle = 'bold';
        }
        
        // Highlight contact number
        if (data.row.index === 0 && data.column.index === 3) {
            data.cell.styles.textColor = [16, 185, 129]; // emerald-500
        }
        
        // Style address differently (darker for better readability)
        if (data.row.index === 1 && data.column.index === 1) {
            data.cell.styles.textColor = [30, 58, 138]; // blue-800
            data.cell.styles.fontStyle = 'normal';
        }
        
        // Highlight date/time with delivery-specific colors
        if (data.row.index === 2) {
            if (data.column.index === 1) { // Date
                data.cell.styles.textColor = [236, 72, 153]; // pink-500
            }
            if (data.column.index === 3) { // Time
                data.cell.styles.textColor = [249, 115, 22]; // orange-500
            }
        }
        
        // Style trading hours with attention-grabbing color
        if (data.row.index === 3 && data.column.index === 1) {
            data.cell.styles.textColor = [6, 95, 70]; // emerald-800
            if (delivery.tradingHours && delivery.tradingHours.includes('Closed')) {
                data.cell.styles.textColor = [220, 38, 38]; // red-600 for closed hours
            }
        }
    }
});
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Instructions Section
  if (delivery.instructions) {
    drawCard(doc, 10, yPos, pageWidth - 20, 20, THEME_COLORS.blue[50], THEME_COLORS.blue[200], 2);
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.blue[800]);
    doc.text('SPECIAL INSTRUCTIONS:', 15, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.blue[900]);
    const instructionLines = doc.splitTextToSize(delivery.instructions, pageWidth - 30);
    doc.text(instructionLines, 15, yPos);
    yPos += instructionLines.length * 4 + 8;
  }
  
  // Appointment Details Section
  if (delivery.appointmentDetails) {
    drawCard(doc, 10, yPos, pageWidth - 20, 20, THEME_COLORS.purple[50], THEME_COLORS.purple[200], 2);
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.purple[800]);
    doc.text('APPOINTMENT DETAILS:', 15, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.purple[900]);
    const appointmentLines = doc.splitTextToSize(delivery.appointmentDetails, pageWidth - 30);
    doc.text(appointmentLines, 15, yPos);
    yPos += appointmentLines.length * 4 + 8;
  }
  
  // Goods Information Section with Tables
  const goods = jobData.deliveryGoods?.[index];
  if (goods) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.red[800]);
    doc.text('GOODS INFORMATION', 15, yPos);
    yPos += 8;

    // Calculate totals
    const totalWeight = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
    }, 0) : 0;
    const totalItems = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
    }, 0) : 0;

    // Goods summary table
    const goodsSummaryData = [
  ['Description:', goods.description || 'N/A', 'Delivery Method:', goods.deliveryMethod || 'N/A'],
  ['Total Weight:', `${totalWeight}kg`, 'Total Items:', `${totalItems} pieces`]
];

doc.autoTable({
  startY: yPos,
  body: goodsSummaryData,
  margin: { left: 15, right: 15 },
  styles: {
    fontSize: 7,
    cellPadding: 3,
    lineWidth: 0.1,
    lineColor: [226, 232, 240], // slate-200 for grid lines
  },
  columnStyles: {
    0: { 
      cellWidth: 35, 
      fontStyle: 'bold', 
      textColor: [55, 65, 81] // slate-800 for field names
    },
    1: { 
      cellWidth: 45, 
      textColor: [71, 85, 105] // slate-700 for values
    },
    2: { 
      cellWidth: 35, 
      fontStyle: 'bold', 
      textColor: [55, 65, 81] // slate-800 for field names
    },
    3: { 
      cellWidth: 40, 
      textColor: [71, 85, 105] // slate-700 for values
    }
  },
  // Custom coloring for specific cells
  didParseCell: function(data) {
    // Highlight description
    if (data.row.index === 0 && data.column.index === 1) {
      data.cell.styles.textColor = [79, 70, 229]; // indigo-600
      data.cell.styles.fontStyle = 'bolditalic';
    }
    
    // Color-code delivery method
    if (data.row.index === 0 && data.column.index === 3) {
      const method = (goods.deliveryMethod || '').toLowerCase();
      if (method.includes('express')) {
        data.cell.styles.textColor = [220, 38, 38]; // red-600 for express
      } else if (method.includes('standard')) {
        data.cell.styles.textColor = [16, 185, 129]; // emerald-500 for standard
      } else if (method.includes('priority')) {
        data.cell.styles.textColor = [234, 88, 12]; // orange-600 for priority
      }
    }
    
    // Highlight weight with gradient color based on value
    if (data.row.index === 1 && data.column.index === 1) {
      const weight = parseFloat(totalWeight) || 0;
      if (weight > 1000) {
        data.cell.styles.textColor = [220, 38, 38]; // red-600 for heavy
      } else if (weight > 500) {
        data.cell.styles.textColor = [234, 88, 12]; // orange-600 for medium
      } else {
        data.cell.styles.textColor = [22, 163, 74]; // green-600 for light
      }
    }
    
    // Highlight item count
    if (data.row.index === 1 && data.column.index === 3) {
      const items = parseInt(totalItems) || 0;
      if (items > 50) {
        data.cell.styles.textColor = [139, 92, 246]; // violet-500 for large quantities
      } else {
        data.cell.styles.textColor = [6, 182, 212]; // cyan-500 for normal quantities
      }
    }
  }
});

    yPos = doc.lastAutoTable.finalY + 8;

    // Current Unit Information Table (if multiple units)
    if (totalUnits > 1 && packagingUnit.packageData) {
      const pkg = packagingUnit.packageData;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.red[800]);
      doc.text(`CURRENT ${packagingUnit.label.toUpperCase()} (${packagingUnit.unitIndex} OF ${packagingUnit.totalUnits})`, 15, yPos);
      yPos += 5;

      const currentUnitData = [];
      if (pkg.weight) {
        const unitWeight = Math.round(pkg.weight / packagingUnit.totalUnits * 100) / 100;
        currentUnitData.push(['Unit Weight:', `~${unitWeight}kg`]);
      }
      if (pkg.dimensions) {
        currentUnitData.push(['Dimensions:', pkg.dimensions]);
      }
      
      const characteristics = [];
      if (pkg.secured) characteristics.push('Secured');
      if (pkg.fragile) characteristics.push('Fragile');
      if (pkg.hazardous) characteristics.push('Hazardous');
      if (pkg.temperature) characteristics.push(`${pkg.temperature}°C`);
      
      if (characteristics.length > 0) {
        currentUnitData.push(['Characteristics:', characteristics.join(' • ')]);
      }

      if (currentUnitData.length > 0) {
        doc.autoTable({
          startY: yPos,
          body: currentUnitData,
          margin: { left: 15, right: 15 },
          styles: {
            fontSize: 6,
            cellPadding: 2,
            lineWidth: 0.1,
            lineColor: [226, 232, 240],
            textColor: [71, 85, 105],
          },
          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold', textColor: [185, 28, 28] }, // red-700
            1: { cellWidth: 110, textColor: [220, 38, 38] } // red-600
          }
        });
        yPos = doc.lastAutoTable.finalY + 8;
      }
    }

    // Packaging details table
    if (goods.packagingTypes) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.red[800]);
      doc.text('PACKAGING DETAILS', 15, yPos);
      yPos += 5;

      const packagingData = [];
      const packagingTypes = ['pallets', 'boxes', 'bags', 'others'];
      const packagingLabels = {
        pallets: 'Pallets',
        boxes: 'Boxes', 
        bags: 'Bags',
        others: 'Loose Items'
      };

      packagingTypes.forEach(type => {
        const pkg = goods.packagingTypes[type];
        if (pkg && pkg.selected) {
          const details = [];
          if (pkg.quantity) details.push(`${pkg.quantity} units`);
          if (pkg.weight) details.push(`${pkg.weight}kg`);
          if (pkg.dimensions) details.push(pkg.dimensions);
          
          const attributes = [];
          if (pkg.secured) attributes.push('Secured');
          if (pkg.fragile) attributes.push('Fragile');
          if (pkg.hazardous) attributes.push('Hazardous');
          
          // Mark current unit
          let typeLabel = packagingLabels[type];
          if (packagingUnit.type === type && totalUnits > 1) {
            typeLabel += ' ★';
          }
          
          packagingData.push([
            typeLabel,
            details.join(' • '),
            attributes.join(' • ') || 'Standard'
          ]);
        }
      });

      if (packagingData.length > 0) {
        doc.autoTable({
          startY: yPos,
          head: [['Type', 'Details', 'Attributes']],
          body: packagingData,
          margin: { left: 15, right: 15 },
          styles: {
            fontSize: 6,
            cellPadding: 2,
            lineWidth: 0.1,
            lineColor: [226, 232, 240],
            textColor: [71, 85, 105],
          },
          headStyles: {
            fillColor: [254, 202, 202], // red-200
            textColor: [153, 27, 27], // red-800
            fontStyle: 'bold',
            fontSize: 7,
          },
          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold', textColor: [185, 28, 28] }, // red-700
            1: { cellWidth: 70 },
            2: { cellWidth: 40 }
          }
        });
        yPos = doc.lastAutoTable.finalY + 8;
      }
    }

    // Special instructions if any
    if (goods.deliveryInstructions) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.blue[800]);
      doc.text('DELIVERY INSTRUCTIONS:', 15, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.blue[600]);
      const instructionLines = doc.splitTextToSize(goods.deliveryInstructions, pageWidth - 30);
      doc.text(instructionLines, 15, yPos);
      yPos += instructionLines.length * 4 + 8;
    }
  }
  
  // QR Code with Packaging Unit Information positioned after content
  try {
    const qrData = JSON.stringify({
      type: 'DELIVERY',
      jobId: jobId,
      locationIndex: index + 1,
      packagingType: packagingUnit.type,
      packagingLabel: packagingUnit.label,
      unitNumber: packagingUnit.unitIndex,
      totalUnits: packagingUnit.totalUnits,
      customer: delivery.customerName,
      date: delivery.date,
      time: delivery.time
    });
    const qrCodeDataURL = await generateQRCodeDataURL(qrData);
    if (qrCodeDataURL) {
      // Position QR code after content or in available space
      const qrY = Math.max(yPos + 10, pageHeight - 80);
      doc.addImage(qrCodeDataURL, 'PNG', pageWidth - 60, qrY, 50, 50);
      doc.setFontSize(6);
      doc.setTextColor(...THEME_COLORS.slate[500]);
      if (totalUnits > 1) {
        doc.text(`${packagingUnit.label} ${packagingUnit.unitIndex}/${packagingUnit.totalUnits}`, pageWidth - 60, qrY + 55);
      } else {
        doc.text('Scan for verification', pageWidth - 60, qrY + 55);
      }
    }
  } catch (error) {
    console.error('QR code generation failed:', error);
  }
  
  // Ultra compact footer with red gradient - reduced by 50% from 18 to 9px
  drawGradientBackground(doc, 0, pageHeight - 9, pageWidth, 9, [THEME_COLORS.red[500], THEME_COLORS.red[600]]);
  
  doc.setFontSize(3.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Phoenix Prime Shipper - Delivery Documentation', 10, pageHeight - 6);
  doc.setFontSize(3);
  const footerText = totalUnits > 1 
    ? `Job ID: ${jobId} | Location ${index + 1} | ${packagingUnit.label} ${packagingUnit.unitIndex}/${packagingUnit.totalUnits}`
    : `Job ID: ${jobId} | Location ${index + 1}`;
  doc.text(footerText, 10, pageHeight - 3);
};

// Export function to download PDF
export const downloadBookingPDF = async (jobData, jobId, otp) => {
  try {
    if (!jobData || !jobId || !otp) {
      throw new Error('Missing required data for PDF generation');
    }

    console.log('Generating comprehensive PDF with all collected details...');
    
    const doc = await generateBookingPDF(jobData, jobId, otp);
    doc.save(`Phoenix_Shipper_Complete_${jobId}.pdf`);
    
    console.log('Comprehensive PDF generated successfully');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    return false;
  }
};