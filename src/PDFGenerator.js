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
  },
  amber: {
    50: [255, 251, 235],         // amber-50
    100: [254, 243, 199],        // amber-100
    200: [253, 230, 138],        // amber-200
    800: [146, 64, 14],          // amber-800
  },
  indigo: {
    50: [238, 242, 255],         // indigo-50
  },
  white: [255, 255, 255],       // white
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
  
  // Compact text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + width / 2, y + height / 2 - 1, { align: 'center' });
  
  if (subtitle) {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, x + width / 2, y + height / 2 + 3, { align: 'center' });
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
  
  // Extra compact header - reduced from 25px to 18px
  drawTripleGradient(doc, 0, 0, pageWidth, 18, THEME_COLORS.primary.blue500, THEME_COLORS.primary.blue600, THEME_COLORS.primary.purple600);
  
  // Compact header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PHOENIX PRIME SHIPPER - MASTER DOCUMENTATION', pageWidth / 2, 12, { align: 'center' });
  
  let yPos = 25;
  
  // Comprehensive Job Information Card
  drawCard(doc, 5, yPos, pageWidth - 10, 45, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 5;
  
  // Card header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('JOB DETAILS', 10, yPos);
  yPos += 8;
  
  // Simple two-column layout for better alignment
  doc.setFontSize(7);
  const leftCol = 20;
  const rightCol = 110;
  const labelWidth = 45;
  
  // Job ID and Driver OTP
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Job ID:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(jobId, leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Driver OTP:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(otp.toString(), rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Date and Time
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Date Created:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(new Date().toLocaleDateString(), leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Time Created:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(new Date().toLocaleTimeString(), rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Job Type and Status
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Job Type:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(getJobTypeLabel(jobData.jobType), leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Status:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text('Confirmed', rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Locations and Transfer Type
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Total Locations:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(`${(jobData.pickups?.length || 0)}P / ${(jobData.deliveries?.length || 0)}D`, leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Transfer Type:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(jobData.transferType || 'Standard', rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Service Level
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Service Level:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(jobData.isRefrigerated ? 'Refrigerated' : 'Standard', leftCol + labelWidth, yPos);
  
  yPos += 12;
  
  // Comprehensive Vehicle & Service Information
  drawCard(doc, 5, yPos, pageWidth - 10, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 5;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('VEHICLE & SERVICE SPECIFICATIONS', 10, yPos);
  yPos += 8;
  
  doc.setFontSize(7);
  const vehicle = jobData.vehicle || {};
  
  // Vehicle specifications in simple two-column layout
  // Vehicle and Capacity
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Vehicle:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(vehicle.name || 'N/A', leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Capacity:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(vehicle.capacity || 'N/A', rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Max Weight and Pallet Capacity
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Max Weight:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(`${vehicle.maxWeight || 'N/A'} tonnes`, leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Pallet Capacity:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(`${vehicle.pallets || 'N/A'} pallets`, rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Body Type and Refrigeration
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Body Type:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(jobData.truckBodyType || 'Standard', leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Refrigeration:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(jobData.isRefrigerated ? 'Required' : 'Not Required', rightCol + labelWidth, yPos);
  
  yPos += 12;
  
  // Comprehensive Pickup Locations with Full Details
  if (jobData.pickups && jobData.pickups.length > 0) {
    const pickupCardHeight = 40 + (jobData.pickups.length * 25);
    drawCard(doc, 5, yPos, pageWidth - 10, pickupCardHeight, THEME_COLORS.emerald[100], THEME_COLORS.emerald[200], 2);
    yPos += 5;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.emerald[800]);
    doc.text('PICKUP LOCATIONS', 10, yPos);
    yPos += 8;
    
    doc.setFontSize(6);
    
    jobData.pickups.forEach((pickup, index) => {
      // Location header
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.emerald[700]);
      doc.text(`${index + 1}. ${pickup.customerName || 'N/A'}`, 10, yPos);
      yPos += 6;
      
      // Detailed location info in columns
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      
      // Address
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.slate[700]);
      doc.text('Address:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      doc.text(formatAddress(pickup.address), 37, yPos);
      yPos += 5;
      
      // Schedule and contact info
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.slate[700]);
      doc.text('Schedule:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      doc.text(`${pickup.date || 'N/A'} at ${pickup.time || 'N/A'}`, 37, yPos);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.slate[700]);
      doc.text('Contact:', 100, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      doc.text(pickup.recipientMobile || 'N/A', 122, yPos);
      yPos += 5;
      
      // Goods and special requirements
      const goods = jobData.pickupGoods?.[index];
      if (goods) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Goods:', 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(goods.description || 'N/A', 32, yPos);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Method:', 100, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(goods.pickupMethod || 'N/A', 122, yPos);
        yPos += 5;
        
        // Packaging summary
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Packaging:', 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        const packagingSummary = formatDetailedPackaging(goods.packagingTypes).replace(/\n/g, ' | ');
        const summaryLines = doc.splitTextToSize(packagingSummary, pageWidth - 60);
        doc.text(summaryLines, 45, yPos);
        yPos += summaryLines.length * 4;
      }
      
      // Special instructions
      if (pickup.instructions) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.blue[700]);
        doc.text('Instructions:', 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.blue[600]);
        const instrLines = doc.splitTextToSize(pickup.instructions, pageWidth - 60);
        doc.text(instrLines, 50, yPos);
        yPos += instrLines.length * 4;
      }
      
      yPos += 3; // Space between locations
    });
    
    yPos += 5;
  }
  
  // Comprehensive Delivery Locations with Full Details
  if (jobData.deliveries && jobData.deliveries.length > 0) {
    const deliveryCardHeight = 40 + (jobData.deliveries.length * 25);
    drawCard(doc, 5, yPos, pageWidth - 10, deliveryCardHeight, THEME_COLORS.red[100], THEME_COLORS.red[200], 2);
    yPos += 5;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.red[800]);
    doc.text('DELIVERY LOCATIONS', 10, yPos);
    yPos += 8;
    
    doc.setFontSize(6);
    
    jobData.deliveries.forEach((delivery, index) => {
      // Location header
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.red[700]);
      doc.text(`${index + 1}. ${delivery.customerName || 'N/A'}`, 10, yPos);
      yPos += 6;
      
      // Detailed location info in columns
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      
      // Address
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.slate[700]);
      doc.text('Address:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      doc.text(formatAddress(delivery.address), 40, yPos);
      yPos += 5;
      
      // Schedule and contact info
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.slate[700]);
      doc.text('Schedule:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      doc.text(`${delivery.date || 'N/A'} at ${delivery.time || 'N/A'}`, 37, yPos);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.slate[700]);
      doc.text('Trading Hours:', 100, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      doc.text(delivery.tradingHours || 'N/A', 137, yPos);
      yPos += 5;
      
      // Goods and special requirements
      const goods = jobData.deliveryGoods?.[index];
      if (goods) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Goods:', 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(goods.description || 'N/A', 32, yPos);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Method:', 100, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(goods.deliveryMethod || 'N/A', 122, yPos);
        yPos += 5;
        
        // Packaging summary
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Packaging:', 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        const packagingSummary = formatDetailedPackaging(goods.packagingTypes).replace(/\n/g, ' | ');
        const summaryLines = doc.splitTextToSize(packagingSummary, pageWidth - 60);
        doc.text(summaryLines, 45, yPos);
        yPos += summaryLines.length * 4;
      }
      
      // Special instructions
      if (delivery.instructions) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.blue[700]);
        doc.text('Instructions:', 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.blue[600]);
        const instrLines = doc.splitTextToSize(delivery.instructions, pageWidth - 60);
        doc.text(instrLines, 50, yPos);
        yPos += instrLines.length * 4;
      }
      
      yPos += 3; // Space between locations
    });
    
    yPos += 5;
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
  
  drawCard(doc, 5, yPos, pageWidth - 10, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 5;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('SHIPMENT TOTALS & CALCULATIONS', 10, yPos);
  yPos += 8;
  
  doc.setFontSize(7);
  
  // Total Weight and Items
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Total Weight:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(`${totalPickupWeight + totalDeliveryWeight}kg`, leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Total Items:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(`${totalPickupItems + totalDeliveryItems} pieces`, rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Total Locations
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Total Locations:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(`${(jobData.pickups?.length || 0) + (jobData.deliveries?.length || 0)}`, leftCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Pickup breakdown
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.emerald[700]);
  doc.text('Pickup Weight:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.emerald[600]);
  doc.text(`${totalPickupWeight}kg`, leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.emerald[700]);
  doc.text('Pickup Items:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.emerald[600]);
  doc.text(`${totalPickupItems} pieces`, rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Delivery breakdown
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.red[700]);
  doc.text('Delivery Weight:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.red[600]);
  doc.text(`${totalDeliveryWeight}kg`, leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.red[700]);
  doc.text('Delivery Items:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.red[600]);
  doc.text(`${totalDeliveryItems} pieces`, rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Pickup and Delivery Locations
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.emerald[700]);
  doc.text('Pickup Locations:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.emerald[600]);
  doc.text(`${jobData.pickups?.length || 0}`, leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.red[700]);
  doc.text('Delivery Locations:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.red[600]);
  doc.text(`${jobData.deliveries?.length || 0}`, rightCol + labelWidth, yPos);
  
  yPos += 15;
  
  // Compact barcode
  if (barcodeDataURL) {
    drawCard(doc, 5, yPos, pageWidth - 10, 20, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
    doc.addImage(barcodeDataURL, 'PNG', 10, yPos + 3, 80, 14);
    doc.setFontSize(6);
    doc.setTextColor(...THEME_COLORS.slate[500]);
    doc.text('Master Tracking Code', 10, yPos + 18);
    yPos += 25;
  }
  
  // Add remaining space for footer
  yPos = Math.max(yPos, pageHeight - 25);
  
  // Footer with app branding
  drawTripleGradient(doc, 0, pageHeight - 25, pageWidth, 25, THEME_COLORS.primary.blue500, THEME_COLORS.primary.blue600, THEME_COLORS.primary.purple600);
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Generated by Phoenix Prime Shipper', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Page 1 of ${1 + (jobData.pickups?.length || 0) + (jobData.deliveries?.length || 0)}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
};

// Generate comprehensive pickup page matching app screens
const generatePickupPage = async (doc, pickup, index, jobData, jobId) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Clean white page background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Compact header - reduced from 45px to 25px
  const title = jobData.pickups.length > 1 ? `PICKUP LOCATION ${index + 1}` : 'PICKUP LOCATION';
  drawSectionHeader(doc, 0, 0, pageWidth, 18, title, 'Collection Details', true, false);
  
  let yPos = 25;
  
  // Compact Customer Information Card
  drawCard(doc, 10, yPos, pageWidth - 20, 45, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 8;
  
  // Compact card header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('CUSTOMER INFORMATION', 15, yPos);
  yPos += 10;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  
  // Customer info in two columns
  const leftCol = 20;
  const rightCol = 110;
  const labelWidth = 45;
  
  // Customer and Mobile
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Customer:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.customerName || 'N/A', leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Mobile:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.recipientMobile || 'N/A', rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Address in full width
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Address:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(formatAddress(pickup.address), leftCol + labelWidth, yPos);
  
  yPos += 15;
  
  // Compact Schedule Information Card
  drawCard(doc, 10, yPos, pageWidth - 20, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('SCHEDULE INFORMATION', 15, yPos);
  yPos += 10;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  
  // Date and Time
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Date:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.date || 'N/A', leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Time:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.time || 'N/A', rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Trading Hours
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Trading Hours:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.tradingHours || 'N/A', leftCol + labelWidth, yPos);
  
  yPos += 15;
  
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
  
  // Comprehensive Goods Information Section
  const goods = jobData.pickupGoods?.[index];
  if (goods) {
    drawCard(doc, 10, yPos, pageWidth - 20, 120, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[800]);
    doc.text('GOODS INFORMATION', 15, yPos);
    yPos += 12;
    
    doc.setFontSize(7);
    const leftCol = 20;
    const rightCol = 110;
    const labelWidth = 45;
    
    // Description and Pickup Method
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Description:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(goods.description || 'N/A', leftCol + labelWidth, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Pickup Method:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(goods.pickupMethod || 'N/A', rightCol + labelWidth, yPos);
    
    yPos += 10;
    
    // Weight and Dimensions
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Total Weight:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const totalWeight = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
    }, 0) : 0;
    doc.text(`${totalWeight}kg`, leftCol + labelWidth, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Total Items:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const totalItems = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
    }, 0) : 0;
    doc.text(`${totalItems} pieces`, rightCol + labelWidth, yPos);
    
    yPos += 10;
    
    // Detailed Packaging Breakdown
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('PACKAGING DETAILS:', leftCol, yPos);
    yPos += 8;
    
    if (goods.packagingTypes) {
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
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...THEME_COLORS.emerald[700]);
          doc.text(`${packagingLabels[type]}:`, leftCol + 5, yPos);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...THEME_COLORS.slate[600]);
          let details = [];
          if (pkg.quantity) details.push(`${pkg.quantity} units`);
          if (pkg.weight) details.push(`${pkg.weight}kg`);
          if (pkg.dimensions) details.push(`${pkg.dimensions}`);
          if (pkg.secured) details.push('Secured');
          if (pkg.fragile) details.push('Fragile');
          
          doc.text(details.join(' • '), leftCol + 35, yPos);
          yPos += 7;
        }
      });
    }
    
    yPos += 5;
    
    // Special Instructions
    if (goods.pickupInstructions) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.blue[700]);
      doc.text('Special Instructions:', leftCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      const instructionLines = doc.splitTextToSize(goods.pickupInstructions, pageWidth - 80);
      doc.text(instructionLines, leftCol + labelWidth, yPos);
      yPos += instructionLines.length * 4;
    }
    
    yPos += 10;
  }
  
  // Compact QR Code
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
      // Compact QR code positioned in top right
      doc.addImage(qrCodeDataURL, 'PNG', pageWidth - 60, 35, 50, 50);
      doc.setFontSize(6);
      doc.setTextColor(...THEME_COLORS.slate[500]);
      doc.text('Scan for verification', pageWidth - 35, 90, { align: 'center' });
    }
  } catch (error) {
    console.error('QR code generation failed:', error);
  }
  
  // Compact footer with emerald gradient
  drawGradientBackground(doc, 0, pageHeight - 18, pageWidth, 18, [THEME_COLORS.emerald[500], THEME_COLORS.emerald[600]]);
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('Phoenix Prime Shipper - Pickup Documentation', pageWidth / 2, pageHeight - 11, { align: 'center' });
  doc.setFontSize(6);
  doc.text(`Job ID: ${jobId} | Location ${index + 1}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
};

// Generate comprehensive delivery page with packaging-based pagination
const generateDeliveryPage = async (doc, delivery, index, jobData, jobId, packagingUnit, totalUnits = 1) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Clean white page background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header with packaging unit information
  const locationTitle = jobData.deliveries.length > 1 ? `DELIVERY LOCATION ${index + 1}` : 'DELIVERY LOCATION';
  const packageTitle = totalUnits > 1 
    ? `${packagingUnit.label.toUpperCase()} ${packagingUnit.unitIndex} OF ${packagingUnit.totalUnits}` 
    : 'DELIVERY DETAILS';
  drawSectionHeader(doc, 0, 0, pageWidth, 18, locationTitle, packageTitle, false, true);
  
  let yPos = 25;
  
  // Packaging Unit Information Section (if multiple units)
  if (totalUnits > 1) {
    drawCard(doc, 10, yPos, pageWidth - 20, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
    yPos += 8;
    
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
    
    yPos += 8;
    
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
      
      yPos += 8;
      
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
  
  // Customer Information Section
  drawCard(doc, 10, yPos, pageWidth - 20, 45, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('CUSTOMER INFORMATION', 15, yPos);
  yPos += 10;
  
  doc.setFontSize(7);
  const leftCol = 20;
  const rightCol = 110;
  const labelWidth = 45;
  
  // Customer and Contact
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Customer:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.customerName || 'N/A', leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Contact:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.contactNumber || 'N/A', rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Address in full width
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Address:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(formatAddress(delivery.address), leftCol + labelWidth, yPos);
  
  yPos += 15;
  
  // Schedule Information Section
  drawCard(doc, 10, yPos, pageWidth - 20, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('SCHEDULE INFORMATION', 15, yPos);
  yPos += 10;
  
  doc.setFontSize(7);
  
  // Date and Time
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Date:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.date || 'N/A', leftCol + labelWidth, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Time:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.time || 'N/A', rightCol + labelWidth, yPos);
  
  yPos += 8;
  
  // Trading Hours
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Trading Hours:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.tradingHours || 'N/A', leftCol + labelWidth, yPos);
  
  yPos += 15;
  
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
  
  // Comprehensive Goods Information Section
  const goods = jobData.deliveryGoods?.[index];
  if (goods) {
    drawCard(doc, 10, yPos, pageWidth - 20, 140, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[800]);
    doc.text('GOODS INFORMATION', 15, yPos);
    yPos += 12;
    
    doc.setFontSize(7);
    
    // Description and Delivery Method
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Description:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(goods.description || 'N/A', leftCol + labelWidth, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Delivery Method:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(goods.deliveryMethod || 'N/A', rightCol + labelWidth, yPos);
    
    yPos += 10;
    
    // Current Packaging Unit Information (if multiple units)
    if (totalUnits > 1 && packagingUnit.packageData) {
      const pkg = packagingUnit.packageData;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.red[700]);
      doc.text(`THIS ${packagingUnit.label.toUpperCase()}:`, leftCol, yPos);
      yPos += 8;
      
      // Unit weight
      if (pkg.weight) {
        const unitWeight = Math.round(pkg.weight / packagingUnit.totalUnits * 100) / 100;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Weight:', leftCol + 5, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(`~${unitWeight}kg`, leftCol + 35, yPos);
      }
      
      // Unit dimensions
      if (pkg.dimensions) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Dimensions:', rightCol, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.slate[600]);
        doc.text(pkg.dimensions, rightCol + labelWidth, yPos);
      }
      
      yPos += 8;
      
      // Special characteristics
      const characteristics = [];
      if (pkg.secured) characteristics.push('Secured');
      if (pkg.fragile) characteristics.push('Fragile');
      if (pkg.hazardous) characteristics.push('Hazardous');
      if (pkg.temperature) characteristics.push(`${pkg.temperature}°C`);
      
      if (characteristics.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...THEME_COLORS.slate[700]);
        doc.text('Characteristics:', leftCol + 5, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...THEME_COLORS.red[600]);
        doc.text(characteristics.join(' • '), leftCol + 55, yPos);
        yPos += 8;
      }
      
      yPos += 2;
    }
    
    // Total Weight and Items
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Total Weight:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const totalWeight = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
    }, 0) : 0;
    doc.text(`${totalWeight}kg`, leftCol + labelWidth, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Total Items:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const totalItems = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
      return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
    }, 0) : 0;
    doc.text(`${totalItems} pieces`, rightCol + labelWidth, yPos);
    
    yPos += 10;
    
    // Detailed Packaging Breakdown
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('PACKAGING DETAILS:', leftCol, yPos);
    yPos += 8;
    
    if (goods.packagingTypes) {
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
          // Highlight current packaging unit
          const isCurrentUnit = packagingUnit.type === type;
          
          doc.setFont('helvetica', 'bold');
          if (isCurrentUnit) {
            doc.setTextColor(...THEME_COLORS.red[700]);
          } else {
            doc.setTextColor(...THEME_COLORS.slate[700]);
          }
          let labelText = `${packagingLabels[type]}:`;
          if (isCurrentUnit && totalUnits > 1) {
            labelText += ` → CURRENT UNIT`;
          }
          doc.text(labelText, leftCol + 5, yPos);
          
          doc.setFont('helvetica', 'normal');
          if (isCurrentUnit) {
            doc.setTextColor(...THEME_COLORS.red[600]);
          } else {
            doc.setTextColor(...THEME_COLORS.slate[600]);
          }
          let details = [];
          if (pkg.quantity) details.push(`${pkg.quantity} units`);
          if (pkg.weight) details.push(`${pkg.weight}kg`);
          if (pkg.dimensions) details.push(`${pkg.dimensions}`);
          if (pkg.secured) details.push('Secured');
          if (pkg.fragile) details.push('Fragile');
          if (pkg.hazardous) details.push('Hazardous');
          
          doc.text(details.join(' • '), leftCol + 35, yPos);
          yPos += 7;
        }
      });
    }
    
    yPos += 5;
    
    // Special Instructions
    if (goods.deliveryInstructions) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...THEME_COLORS.blue[700]);
      doc.text('Special Instructions:', leftCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...THEME_COLORS.slate[600]);
      const instructionLines = doc.splitTextToSize(goods.deliveryInstructions, pageWidth - 80);
      doc.text(instructionLines, leftCol + labelWidth, yPos);
      yPos += instructionLines.length * 4;
    }
    
    yPos += 10;
  }
  
  // QR Code with Packaging Unit Information
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
      // QR code positioned in top right
      doc.addImage(qrCodeDataURL, 'PNG', pageWidth - 60, 35, 50, 50);
      doc.setFontSize(6);
      doc.setTextColor(...THEME_COLORS.slate[500]);
      if (totalUnits > 1) {
        doc.text(`${packagingUnit.label} ${packagingUnit.unitIndex}/${packagingUnit.totalUnits}`, pageWidth - 35, 90, { align: 'center' });
      } else {
        doc.text('Scan for verification', pageWidth - 35, 90, { align: 'center' });
      }
    }
  } catch (error) {
    console.error('QR code generation failed:', error);
  }
  
  // Compact footer with red gradient
  drawGradientBackground(doc, 0, pageHeight - 18, pageWidth, 18, [THEME_COLORS.red[500], THEME_COLORS.red[600]]);
  
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('Phoenix Prime Shipper - Delivery Documentation', pageWidth / 2, pageHeight - 11, { align: 'center' });
  doc.setFontSize(6);
  const footerText = totalUnits > 1 
    ? `Job ID: ${jobId} | Location ${index + 1} | ${packagingUnit.label} ${packagingUnit.unitIndex}/${packagingUnit.totalUnits}`
    : `Job ID: ${jobId} | Location ${index + 1}`;
  doc.text(footerText, pageWidth / 2, pageHeight - 5, { align: 'center' });
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