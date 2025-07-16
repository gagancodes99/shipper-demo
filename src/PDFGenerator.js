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

// Card component helper matching app design: bg-white rounded-xl border border-slate-200 shadow-sm
const drawCard = (doc, x, y, width, height, fillColor = THEME_COLORS.white, borderColor = THEME_COLORS.slate[200], cornerRadius = 3) => {
  // Draw rounded rectangle background
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, width, height, cornerRadius, cornerRadius, 'F');
  
  // Draw border
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, width, height, cornerRadius, cornerRadius, 'S');
  
  // Add subtle shadow effect
  doc.setDrawColor(...THEME_COLORS.slate[100]);
  doc.setLineWidth(0.2);
  doc.roundedRect(x + 0.5, y + 0.5, width, height, cornerRadius, cornerRadius, 'S');
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
  
  // Text - much smaller and compact
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + width / 2, y + height / 2 - 1, { align: 'center' });
  
  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, x + width / 2, y + height / 2 + 5, { align: 'center' });
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
  
  // Generate delivery pages
  if (jobData.deliveries && jobData.deliveries.length > 0) {
    for (let i = 0; i < jobData.deliveries.length; i++) {
      doc.addPage();
      await generateDeliveryPage(doc, jobData.deliveries[i], i, jobData, jobId);
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
  
  // Compact header - reduced from 50px to 25px
  drawTripleGradient(doc, 0, 0, pageWidth, 25, THEME_COLORS.primary.blue500, THEME_COLORS.primary.blue600, THEME_COLORS.primary.purple600);
  
  // Compact header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PHOENIX PRIME SHIPPER - MASTER DOCUMENTATION', pageWidth / 2, 17, { align: 'center' });
  
  let yPos = 35;
  
  // Compact Job Information Card
  drawCard(doc, 5, yPos, pageWidth - 10, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 5;
  
  // Card header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('JOB DETAILS', 10, yPos);
  yPos += 8;
  
  // Compact job info in three columns
  doc.setFontSize(7);
  const col1X = 10, col2X = 70, col3X = 130;
  
  // Column 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Job ID:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(jobId, col1X + 25, yPos);
  
  // Column 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Driver OTP:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(otp.toString(), col2X + 35, yPos);
  
  // Column 3
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Status:', col3X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text('Confirmed', col3X + 25, yPos);
  
  yPos += 8;
  
  // Second row
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Date:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(new Date().toLocaleDateString(), col1X + 20, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Time:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(new Date().toLocaleTimeString(), col2X + 20, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Type:', col3X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(getJobTypeLabel(jobData.jobType), col3X + 20, yPos);
  
  yPos += 15;
  
  // Vehicle & Service Information
  drawCard(doc, 5, yPos, pageWidth - 10, 25, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 5;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('VEHICLE & SERVICE', 10, yPos);
  yPos += 8;
  
  doc.setFontSize(7);
  const vehicle = jobData.vehicle || {};
  const vehicleText = `${vehicle.name || 'N/A'} (${vehicle.capacity || 'N/A'}) - ${vehicle.pallets || 'N/A'} pallets, ${vehicle.maxWeight || 'N/A'}t max`;
  const serviceText = `${jobData.truckBodyType || 'Standard'} | ${jobData.transferType || 'Standard'} | ${jobData.isRefrigerated ? 'Refrigerated' : 'Standard'}`;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(vehicleText, 10, yPos);
  yPos += 6;
  doc.text(serviceText, 10, yPos);
  yPos += 15;
  
  // Pickup Locations
  if (jobData.pickups && jobData.pickups.length > 0) {
    drawCard(doc, 5, yPos, pageWidth - 10, 30 + (jobData.pickups.length * 8), THEME_COLORS.emerald[100], THEME_COLORS.emerald[200], 2);
    yPos += 5;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.emerald[800]);
    doc.text('PICKUP LOCATIONS', 10, yPos);
    yPos += 8;
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    
    jobData.pickups.forEach((pickup, index) => {
      const locationText = `${index + 1}. ${pickup.customerName || 'N/A'} - ${pickup.date || 'N/A'} at ${pickup.time || 'N/A'}`;
      const addressText = `   ${formatAddress(pickup.address)}`;
      doc.text(locationText, 10, yPos);
      yPos += 6;
      doc.setTextColor(...THEME_COLORS.slate[500]);
      doc.text(addressText, 10, yPos);
      doc.setTextColor(...THEME_COLORS.slate[600]);
      yPos += 8;
    });
    
    yPos += 5;
  }
  
  // Delivery Locations
  if (jobData.deliveries && jobData.deliveries.length > 0) {
    drawCard(doc, 5, yPos, pageWidth - 10, 30 + (jobData.deliveries.length * 8), THEME_COLORS.red[100], THEME_COLORS.red[200], 2);
    yPos += 5;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.red[800]);
    doc.text('DELIVERY LOCATIONS', 10, yPos);
    yPos += 8;
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    
    jobData.deliveries.forEach((delivery, index) => {
      const locationText = `${index + 1}. ${delivery.customerName || 'N/A'} - ${delivery.date || 'N/A'} at ${delivery.time || 'N/A'}`;
      const addressText = `   ${formatAddress(delivery.address)}`;
      doc.text(locationText, 10, yPos);
      yPos += 6;
      doc.setTextColor(...THEME_COLORS.slate[500]);
      doc.text(addressText, 10, yPos);
      doc.setTextColor(...THEME_COLORS.slate[600]);
      yPos += 8;
    });
    
    yPos += 5;
  }
  
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
  
  // Page background matching app: min-h-screen bg-slate-50
  doc.setFillColor(...THEME_COLORS.slate[50]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Compact header - reduced from 45px to 25px
  const title = jobData.pickups.length > 1 ? `PICKUP LOCATION ${index + 1}` : 'PICKUP LOCATION';
  drawSectionHeader(doc, 0, 0, pageWidth, 25, title, 'Collection Details', true, false);
  
  let yPos = 35;
  
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
  
  // Compact customer info in two columns
  const col1X = 15, col2X = pageWidth / 2 + 5;
  
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Customer:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.customerName || 'N/A', col1X + 30, yPos);
  
  // Right column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Mobile:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.recipientMobile || 'N/A', col2X + 25, yPos);
  
  yPos += 8;
  
  // Address in full width
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Address:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(formatAddress(pickup.address), col1X + 30, yPos);
  
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
  
  // Compact schedule info in two columns
  const schedCol1X = 15, schedCol2X = pageWidth / 2 + 5;
  
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Date:', schedCol1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.date || 'N/A', schedCol1X + 20, yPos);
  
  // Right column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Time:', schedCol2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.time || 'N/A', schedCol2X + 20, yPos);
  
  yPos += 8;
  
  // Second row
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Trading Hours:', schedCol1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(pickup.tradingHours || 'N/A', schedCol1X + 45, yPos);
  
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
  
  // Compact Goods Information Card
  const goods = jobData.pickupGoods?.[index];
  if (goods) {
    const cardHeight = 60;
    drawCard(doc, 10, yPos, pageWidth - 20, cardHeight, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[800]);
    doc.text('GOODS INFORMATION', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    // Compact goods info in two columns
    const goodsCol1X = 15, goodsCol2X = pageWidth / 2 + 5;
    
    // Left column - Description
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Description:', goodsCol1X, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const descLines = doc.splitTextToSize(goods.description || 'N/A', (pageWidth / 2) - 40);
    doc.text(descLines, goodsCol1X + 35, yPos);
    
    // Right column - Methods
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Pickup Method:', goodsCol2X, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(goods.pickupMethod || 'N/A', goodsCol2X + 40, yPos);
    
    yPos += Math.max(descLines.length * 4, 8);
    
    // Packaging details
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Packaging:', goodsCol1X, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const packagingLines = doc.splitTextToSize(formatDetailedPackaging(goods.packagingTypes), pageWidth - 40);
    doc.text(packagingLines, goodsCol1X + 35, yPos);
    
    yPos += packagingLines.length * 4 + 10;
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
  
  // Footer with emerald gradient matching app
  drawGradientBackground(doc, 0, pageHeight - 25, pageWidth, 25, [THEME_COLORS.emerald[500], THEME_COLORS.emerald[600]]);
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Phoenix Prime Shipper - Pickup Documentation', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Job ID: ${jobId} | Location ${index + 1}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
};

// Generate comprehensive delivery page matching app screens
const generateDeliveryPage = async (doc, delivery, index, jobData, jobId) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Page background matching app: min-h-screen bg-slate-50
  doc.setFillColor(...THEME_COLORS.slate[50]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Compact header - reduced from 45px to 25px
  const title = jobData.deliveries.length > 1 ? `DELIVERY LOCATION ${index + 1}` : 'DELIVERY LOCATION';
  drawSectionHeader(doc, 0, 0, pageWidth, 25, title, 'Drop-off Details', false, true);
  
  let yPos = 35;
  
  // Compact Customer Information Card
  drawCard(doc, 10, yPos, pageWidth - 20, 35, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[800]);
  doc.text('CUSTOMER INFORMATION', 15, yPos);
  yPos += 10;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  
  // Compact customer info - customer name and address
  const col1X = 15;
  
  // Customer name
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Customer:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.customerName || 'N/A', col1X + 30, yPos);
  
  yPos += 8;
  
  // Address in full width
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Address:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(formatAddress(delivery.address), col1X + 30, yPos);
  
  yPos += 8;
  
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
  
  // Compact schedule info in two columns
  const schedCol1X = 15, schedCol2X = pageWidth / 2 + 5;
  
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Date:', schedCol1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.date || 'N/A', schedCol1X + 20, yPos);
  
  // Right column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Time:', schedCol2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.time || 'N/A', schedCol2X + 20, yPos);
  
  yPos += 8;
  
  // Second row
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...THEME_COLORS.slate[700]);
  doc.text('Trading Hours:', schedCol1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...THEME_COLORS.slate[600]);
  doc.text(delivery.tradingHours || 'N/A', schedCol1X + 45, yPos);
  
  yPos += 8;
  
  // Compact Instructions Card
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
  
  // Compact Appointment Details Card
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
  
  // Compact Goods Information Card
  const goods = jobData.deliveryGoods?.[index];
  if (goods) {
    const cardHeight = 60;
    drawCard(doc, 10, yPos, pageWidth - 20, cardHeight, THEME_COLORS.white, THEME_COLORS.slate[200], 2);
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[800]);
    doc.text('GOODS INFORMATION', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    // Compact goods info in two columns
    const goodsCol1X = 15, goodsCol2X = pageWidth / 2 + 5;
    
    // Left column - Description
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Description:', goodsCol1X, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const descLines = doc.splitTextToSize(goods.description || 'N/A', (pageWidth / 2) - 40);
    doc.text(descLines, goodsCol1X + 35, yPos);
    
    // Right column - Methods
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Delivery Method:', goodsCol2X, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    doc.text(goods.deliveryMethod || 'N/A', goodsCol2X + 45, yPos);
    
    yPos += Math.max(descLines.length * 4, 8);
    
    // Packaging details
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...THEME_COLORS.slate[700]);
    doc.text('Packaging:', goodsCol1X, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...THEME_COLORS.slate[600]);
    const packagingLines = doc.splitTextToSize(formatDetailedPackaging(goods.packagingTypes), pageWidth - 40);
    doc.text(packagingLines, goodsCol1X + 35, yPos);
    
    yPos += packagingLines.length * 4 + 10;
  }
  
  // Compact QR Code
  try {
    const qrData = JSON.stringify({
      type: 'DELIVERY',
      jobId: jobId,
      locationIndex: index + 1,
      customer: delivery.customerName,
      date: delivery.date,
      time: delivery.time
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
  
  // Footer with red gradient matching app
  drawGradientBackground(doc, 0, pageHeight - 25, pageWidth, 25, [THEME_COLORS.red[500], THEME_COLORS.red[600]]);
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Phoenix Prime Shipper - Delivery Documentation', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Job ID: ${jobId} | Location ${index + 1}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
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