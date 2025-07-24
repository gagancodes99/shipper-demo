import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

// Theme colors matching the original design
const THEME_COLORS = {
  primary: {
    blue500: '#3B82F6',
    blue600: '#2563EB', 
    purple600: '#9333EA',
  },
  blue: {
    50: '#F0F9FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  emerald: {
    100: '#D1FAE5',
    200: '#A7F3D0',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
  },
  red: {
    100: '#FEE2E2',
    200: '#FECACA',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
  },
  purple: {
    50: '#FAF5FF',
    200: '#DDD6FE',
    600: '#9333EA',
    800: '#6D28D9',
    900: '#581C87',
  },
  orange: {
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    800: '#92400E',
  },
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    500: '#06B6D4',
    600: '#0891B2',
  },
  white: '#FFFFFF',
};

// Styles for the PDF components
const styles = StyleSheet.create({
  // Page Layout
  page: {
    flexDirection: 'column',
    backgroundColor: THEME_COLORS.slate[50],
    padding: 24,
    // Extra space for footer
    fontFamily: 'Helvetica', // Base font family
  },

  // Header Styles
header: {
  position: 'absolute',      // Place it at the top of the screen
  top: 0,                    // No space from top
  left: 0,
  right: 0,
  height: 42,
  backgroundColor: THEME_COLORS.primary.blue600,
  justifyContent: 'center',
  paddingHorizontal: 18,
  shadowColor: THEME_COLORS.slate[800],
  shadowOpacity: 0.1,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
  zIndex: 10,                // Ensures it's on top of other content
},

  headerText: {
    color: THEME_COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginLeft:100
  },

  // Card Styles
  card: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginTop:30,
    // marginBottom: 26,
    borderWidth: 1,
    borderColor: THEME_COLORS.slate[200],
    borderStyle: 'solid',
    shadowColor: THEME_COLORS.slate[300],
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    elevation: 1,
  },

  // Section Styles
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    color: THEME_COLORS.slate[800],
    letterSpacing: 0.3,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.slate[200],
    paddingBottom: 4,
  },
  sectionTitleEmerald: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    color: THEME_COLORS.emerald[700],
    letterSpacing: 0.3,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.emerald[200],
    paddingBottom: 4,
  },
  sectionTitleRed: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    color: THEME_COLORS.red[700],
    letterSpacing: 0.3,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.red[200],
    paddingBottom: 4,
  },

  // Grid System
  gridRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8, // Added gap between cells
  },
  gridCell: {
    flex: 1,
    padding: 8,
    backgroundColor: THEME_COLORS.slate[50],
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: THEME_COLORS.slate[200],
    borderStyle: 'solid',
    minHeight: 26, // Minimum height for better alignment
  },
  gridCellPrimary: {
    flex: 1,
    padding: 8,
    backgroundColor: THEME_COLORS.blue[50],
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: THEME_COLORS.blue[200],
    borderStyle: 'solid',
    minHeight: 36,
  },
  gridCellSuccess: {
    flex: 1,
    padding: 8,
    backgroundColor: THEME_COLORS.emerald[100],
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: THEME_COLORS.emerald[200],
    borderStyle: 'solid',
    minHeight: 36,
  },
  gridCellWarning: {
    flex: 1,
    padding: 8,
    backgroundColor: THEME_COLORS.red[100],
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: THEME_COLORS.red[200],
    borderStyle: 'solid',
    minHeight: 36,
  },

  // Typography System
  fieldLabel: {
    fontSize: 8,
    color: THEME_COLORS.slate[500],
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  fieldValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.slate[700],
    lineHeight: 1.3,
  },
  fieldValuePrimary: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.primary.blue600,
    lineHeight: 1.3,
  },
  fieldValueSuccess: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.emerald[600],
    lineHeight: 1.3,
  },
  fieldValueWarning: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.red[600],
    lineHeight: 1.3,
  },
  fieldValueEmerald: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.emerald[600],
    lineHeight: 1.3,
  },
  fieldValueOrange: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.orange[600],
    lineHeight: 1.3,
  },
  fieldValueRed: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.red[600],
    lineHeight: 1.3,
  },

  // Table Styles
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: THEME_COLORS.slate[200],
    marginVertical: 8,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: THEME_COLORS.slate[200],
    backgroundColor: THEME_COLORS.slate[100],
    paddingVertical: 6,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: THEME_COLORS.slate[200],
    paddingVertical: 6,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 9,
    fontWeight: 'bold',
    color: THEME_COLORS.slate[700],
    paddingHorizontal: 4,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 8,
    color: THEME_COLORS.slate[600],
    paddingHorizontal: 4,
    lineHeight: 1.4,
  },

  // Instructions Box
  instructionsBox: {
    backgroundColor: THEME_COLORS.blue[50],
    borderWidth: 1,
    borderColor: THEME_COLORS.blue[200],
    borderStyle: 'solid',
    borderRadius: 6,
    padding: 12,
    marginTop:12,
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: THEME_COLORS.blue[800],
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 8,
    color: THEME_COLORS.blue[900],
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 46,
    backgroundColor: THEME_COLORS.primary.blue600,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    shadowColor: THEME_COLORS.slate[800],
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: -2 },
    elevation: 2,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: THEME_COLORS.white,
    fontSize: 9,
    marginHorizontal: 6,
  },
  footerPageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME_COLORS.white,
    marginRight: 12,
    letterSpacing: 0.5,
  },
  footerDivider: {
    width: 1,
    height: 16,
    backgroundColor: THEME_COLORS.white,
    opacity: 0.3,
    marginHorizontal: 8,
  },

  // QR Code and Barcode styles
  qrCodeContainer: {
    position: 'absolute',
    right: 24,
    bottom: 60,
    alignItems: 'center',
    backgroundColor: THEME_COLORS.white,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME_COLORS.slate[200],
  },
  qrCode: {
    width: 70,
    height: 70,
  },
  qrCodeLabel: {
    fontSize: 7,
    color: THEME_COLORS.slate[600],
    marginTop: 6,
    textAlign: 'center',
  },
  barcodeContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: THEME_COLORS.white,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME_COLORS.slate[200],
  },
  barcode: {
    width: 220,
    height: 50,
  },
  barcodeLabel: {
    fontSize: 8,
    color: THEME_COLORS.slate[600],
    marginTop: 8,
    textAlign: 'center',
  },

  // Utility Styles
  textCenter: {
    textAlign: 'center',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
  py8: {
    paddingVertical: 8,
  },
});

// Utility functions
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

// QR Code generation function
const generateQRCodeDataURL = async (data) => {
  try {
    return await QRCode.toDataURL(data, { 
      width: 200, 
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('QR Code generation error:', err);
    return null;
  }
};

// Barcode generation function
const generateBarcodeDataURL = (data) => {
  try {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      console.warn('Barcode generation requires browser environment');
      return null;
    }
    
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, data, { 
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: false,
      margin: 10,
      background: '#FFFFFF',
      lineColor: '#000000'
    });
    return canvas.toDataURL();
  } catch (err) {
    console.error('Barcode generation error:', err);
    return null;
  }
};

// Grid Cell Component
const GridCell = ({ label, value, style, labelStyle, valueStyle }) => {
  // Ensure safe values
  const safeLabel = label || '';
  const safeValue = value || '';
  const safeStyle = style || {};
  const safeLabelStyle = labelStyle || {};
  const safeValueStyle = valueStyle || {};

  // Sanitize font weight to prevent NaN issues
  const sanitizeStyle = (styleObj) => {
    if (!styleObj) return {};
    const cleanStyle = { ...styleObj };
    if (cleanStyle.fontWeight && typeof cleanStyle.fontWeight !== 'string') {
      cleanStyle.fontWeight = 'normal';
    }
    return cleanStyle;
  };

  return (
    <View style={[styles.gridCell, sanitizeStyle(safeStyle)]}>
      <Text style={[styles.fieldLabel, sanitizeStyle(safeLabelStyle)]}>{safeLabel}:</Text>
      <Text style={[styles.fieldValue, sanitizeStyle(safeValueStyle)]}>{safeValue}</Text>
    </View>
  );
};

// Summary Page Component
const SummaryPage = ({ jobData, jobId, otp, barcodeDataURL }) => {
  const totalPickupWeight = calculateTotalWeight(jobData.pickupGoods);
  const totalDeliveryWeight = calculateTotalWeight(jobData.deliveryGoods);
  const totalPickupItems = calculateTotalItems(jobData.pickupGoods);
  const totalDeliveryItems = calculateTotalItems(jobData.deliveryGoods);
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PHOENIX PRIME SHIPPER - MASTER DOCUMENTATION</Text>
      </View>
      
      {/* Booking Confirmed Section */}
      <View style={styles.card }>
        <Text style={[styles.sectionTitle, { textAlign: 'center', color: THEME_COLORS.emerald[600] }]}>
          BOOKING CONFIRMED
        </Text>
        <Text style={{ fontSize: 8, textAlign: 'center', color: THEME_COLORS.slate[600] }}>
          Your shipping request has been confirmed
        </Text>
      </View>
      
      {/* Master Documentation Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Master Documentation</Text>
        <Text style={{ fontSize: 7, color: THEME_COLORS.slate[600], marginBottom: 8 }}>
          Job reference and details
        </Text>
        
        {/* Job Details Grid */}
        <View style={styles.gridRow}>
          <GridCell 
            label="Job ID" 
            value={jobId} 
            style={styles.gridCell}
            valueStyle={styles.fieldValuePrimary}
          />
          {/* <GridCell 
            label="OTP" 
            value={otp.toString()} 
            style={styles.gridCellPrimary}
            valueStyle={styles.fieldValuePrimary}
          /> */}
            <GridCell 
            label="Status" 
            value="Confirmed" 
            style={styles.gridCellSuccess}
            valueStyle={styles.fieldValueSuccess}
          />
        </View>
        <View style={styles.gridRow}>
        
          <GridCell 
            label="Type" 
            value={getJobTypeLabel(jobData.jobType)} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
        </View>
      </View>
      
      {/* Vehicle & Service Information */}
      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { color: THEME_COLORS.primary.blue600 }]}>
          Vehicle & Service Information
        </Text>
        <Text style={{ fontSize: 7, color: THEME_COLORS.slate[600], marginBottom: 8 }}>
          Transportation details
        </Text>
        
        {/* Vehicle Details Grid */}
        <View style={styles.gridRow}>
          <GridCell 
            label="Vehicle" 
            value={jobData.vehicle?.name || 'Van (1T)'} 
            style={styles.gridCell}
            valueStyle={styles.fieldValuePrimary}
          />
          <GridCell 
            label="Capacity" 
            value={jobData.vehicle?.capacity || '1 Tonne'} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
        </View>
        <View style={styles.gridRow}>
          <GridCell 
            label="Max Weight" 
            value={`${jobData.vehicle?.maxWeight || '1'} tonnes`} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
          <GridCell 
            label="Pallet Capacity" 
            value={`${jobData.vehicle?.pallets || '2'} Pallets`} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
        </View>
        <View style={styles.gridRow}>
          <GridCell 
            label="Body Type" 
            value={jobData.truckBodyType || 'Pantech'} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
          <GridCell 
            label="Refrigeration" 
            value={jobData.isRefrigerated ? 'Required' : 'Not Required'} 
            style={styles.gridCell}
            valueStyle={jobData.isRefrigerated ? styles.fieldValueSuccess : styles.fieldValue}
          />
        </View>
      </View>
      
      {/* Pickup Locations */}
      {jobData.pickups && jobData.pickups.length > 0 && (
        <View style={[styles.card, { backgroundColor: THEME_COLORS.blue[50] }]}>
          <Text style={[styles.sectionTitle, { color: THEME_COLORS.primary.blue600 }]}>PICKUP LOCATIONS</Text>
          {jobData.pickups.map((pickup, index) => {
            const goods = jobData.pickupGoods?.[index];
            const packagingSummary = getPackagingSummary(goods?.packagingTypes);
            
            return (
              <View key={index} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: THEME_COLORS.primary.blue600 }}>
                  {index + 1}. {pickup.customerName || 'N/A'}
                </Text>
                <Text style={{ fontSize: 10, color: THEME_COLORS.slate[600] }}>
                  {formatAddress(pickup.address)}
                </Text>
                <Text style={{ fontSize: 9, color: THEME_COLORS.slate[600] }}>
                  {pickup.date || 'N/A'} at {pickup.time || 'N/A'} | {pickup.recipientMobile || 'N/A'}
                </Text>
                <Text style={{ fontSize: 8, color: THEME_COLORS.slate[700] }}>
                  {packagingSummary}
                </Text>
              </View>
            );
          })}
        </View>
      )}
      
      {/* Delivery Locations */}
      {jobData.deliveries && jobData.deliveries.length > 0 && (
        <View style={[styles.card, { backgroundColor: THEME_COLORS.slate[50] }]}>
          <Text style={[styles.sectionTitle, { color: THEME_COLORS.slate[700] }]}>DELIVERY LOCATIONS</Text>
          {jobData.deliveries.map((delivery, index) => {
            const goods = jobData.deliveryGoods?.[index];
            const packagingSummary = getPackagingSummary(goods?.packagingTypes);
            
            return (
              <View key={index} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: THEME_COLORS.slate[700] }}>
                  {index + 1}. {delivery.customerName || 'N/A'}
                </Text>
                <Text style={{ fontSize: 10, color: THEME_COLORS.slate[600] }}>
                  {formatAddress(delivery.address)}
                </Text>
                <Text style={{ fontSize: 9, color: THEME_COLORS.slate[600] }}>
                  {delivery.date || 'N/A'} at {delivery.time || 'N/A'} | {delivery.tradingHours || 'N/A'}
                </Text>
                <Text style={{ fontSize: 8, color: THEME_COLORS.slate[700] }}>
                  {packagingSummary}
                </Text>
              </View>
            );
          })}
        </View>
      )}
      
      {/* Shipment Totals */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>SHIPMENT TOTALS & CALCULATIONS</Text>
        
        <View style={styles.gridRow}>
          <GridCell 
            label="Total Weight" 
            value={`${totalPickupWeight + totalDeliveryWeight}kg`} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
          <GridCell 
            label="Total Items" 
            value={`${totalPickupItems + totalDeliveryItems} pieces`} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
        </View>
        <View style={styles.gridRow}>
          <GridCell 
            label="Total Locations" 
            value={`${(jobData.pickups?.length || 0) + (jobData.deliveries?.length || 0)}`} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
          <GridCell 
            label="Job Type" 
            value={getJobTypeLabel(jobData.jobType)} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
        </View>
        <View style={styles.gridRow}>
          <GridCell 
            label="Pickup Weight" 
            value={`${totalPickupWeight}kg`} 
            style={styles.gridCellPrimary}
            valueStyle={styles.fieldValuePrimary}
          />
          <GridCell 
            label="Pickup Items" 
            value={`${totalPickupItems} pieces`} 
            style={styles.gridCellPrimary}
            valueStyle={styles.fieldValuePrimary}
          />
        </View>
        <View style={styles.gridRow}>
          <GridCell 
            label="Delivery Weight" 
            value={`${totalDeliveryWeight}kg`} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
          <GridCell 
            label="Delivery Items" 
            value={`${totalDeliveryItems} pieces`} 
            style={styles.gridCell}
            valueStyle={styles.fieldValue}
          />
        </View>
      </View>
      
      {/* Barcode Section */}
      {barcodeDataURL && (
        <View style={styles.barcodeContainer}>
          <Image style={styles.barcode} src={barcodeDataURL} />
          <Text style={styles.barcodeLabel}>Master Tracking Code</Text>
        </View>
      )}
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by Phoenix Prime Shipper</Text>
        <Text style={[styles.footerText, { fontSize: 9 }]}>
          Page 1 of {1 + (jobData.pickups?.length || 0) + (jobData.deliveries?.length || 0)}
        </Text>
      </View>
    </Page>
  );
};

// Helper function for packaging summary
const getPackagingSummary = (packagingTypes) => {
  if (!packagingTypes) return 'No packaging';
  
  const items = [];
  const pt = packagingTypes;
  
  if (pt?.pallets?.selected) items.push(`${pt.pallets.quantity || 0} Pallets (${pt.pallets.weight || 0}kg)`);
  if (pt?.boxes?.selected) items.push(`${pt.boxes.quantity || 0} Boxes (${pt.boxes.weight || 0}kg)`);
  if (pt?.bags?.selected) items.push(`${pt.bags.quantity || 0} Bags (${pt.bags.weight || 0}kg)`);
  if (pt?.others?.selected) items.push(`${pt.others.quantity || 0} Items (${pt.others.weight || 0}kg)`);
  
  return items.length > 0 ? items.join(', ') : 'No packaging';
};

// Pickup Page Component
const PickupPage = ({ pickup, index, jobData, jobId, qrCodeDataURL }) => {
  const goods = jobData.pickupGoods?.[index];
  const title = jobData.pickups.length > 1 ? `PICKUP LOCATION ${index + 1}` : 'PICKUP LOCATION';
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: THEME_COLORS.emerald[600] }]}>
        <Text style={styles.headerText}>{title} - Collection Details</Text>
      </View>
      
      {/* Customer & Schedule Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitleEmerald}>CUSTOMER & SCHEDULE INFORMATION</Text>
        
        <View style={styles.gridRow}>
          <GridCell 
            label="Customer" 
            value={pickup.customerName || 'N/A'} 
            style={styles.gridCell}
            valueStyle={{ fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.blue[600] }}
          />
          <GridCell 
            label="Mobile" 
            value={pickup.recipientMobile || 'N/A'} 
            style={styles.gridCell}
            valueStyle={styles.fieldValueEmerald}
          />
        </View>
        
        <View style={styles.gridRow}>
          <View style={[styles.gridCell, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Address:</Text>
            <Text style={[styles.fieldValue, { color: THEME_COLORS.blue[800] }]}>
              {formatAddress(pickup.address)}
            </Text>
          </View>
        </View>
        
        <View style={styles.gridRow}>
          <GridCell 
            label="Date" 
            value={pickup.date || 'N/A'} 
            style={styles.gridCell}
            valueStyle={{ fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.red[600] }}
          />
          <GridCell 
            label="Time" 
            value={pickup.time || 'N/A'} 
            style={styles.gridCell}
            valueStyle={styles.fieldValueOrange}
          />
        </View>
        
        <View style={styles.gridRow}>
          <View style={[styles.gridCell, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Trading Hours:</Text>
            <Text style={[styles.fieldValue, { color: THEME_COLORS.emerald[800] }]}>
              {pickup.tradingHours || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Instructions */}
      {pickup.instructions && (
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>SPECIAL INSTRUCTIONS:</Text>
          <Text style={styles.instructionsText}>{pickup.instructions}</Text>
        </View>
      )}
      
      {/* Appointment Details */}
      {pickup.appointmentDetails && (
        <View style={[styles.instructionsBox, { backgroundColor: THEME_COLORS.purple[50], borderColor: THEME_COLORS.purple[200] }]}>
          <Text style={[styles.instructionsTitle, { color: THEME_COLORS.purple[800] }]}>APPOINTMENT DETAILS:</Text>
          <Text style={[styles.instructionsText, { color: THEME_COLORS.purple[900] }]}>{pickup.appointmentDetails}</Text>
        </View>
      )}
      
      {/* Goods Information */}
      {goods && (
        <View style={styles.card}>
          <Text style={styles.sectionTitleEmerald}>GOODS INFORMATION</Text>
          
          {/* Calculate totals */}
          {(() => {
            const totalWeight = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
              return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
            }, 0) : 0;
            const totalItems = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
              return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
            }, 0) : 0;
            
            return (
              <>
                <View style={styles.gridRow}>
                  <GridCell 
                    label="Description" 
                    value={goods.description || 'N/A'} 
                    style={styles.gridCell}
                    valueStyle={{ fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.blue[600] }}
                  />
                  <GridCell 
                    label="Pickup Method" 
                    value={goods.pickupMethod || 'N/A'} 
                    style={styles.gridCell}
                    valueStyle={styles.fieldValue}
                  />
                </View>
                <View style={styles.gridRow}>
                  <GridCell 
                    label="Total Weight" 
                    value={`${totalWeight}kg`} 
                    style={styles.gridCell}
                    valueStyle={styles.fieldValue}
                  />
                  <GridCell 
                    label="Total Items" 
                    value={`${totalItems} pieces`} 
                    style={styles.gridCell}
                    valueStyle={styles.fieldValue}
                  />
                </View>
              </>
            );
          })()}
          
          {/* Packaging Details */}
          {goods.packagingTypes && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.sectionTitleEmerald, { fontSize: 10, marginBottom: 6 }]}>PACKAGING DETAILS</Text>
              {renderPackagingDetails(goods.packagingTypes)}
            </View>
          )}
          
          {/* Special Instructions */}
          {goods.pickupInstructions && (
            <View style={[styles.instructionsBox, { marginTop: 8 }]}>
              <Text style={styles.instructionsTitle}>PICKUP INSTRUCTIONS:</Text>
              <Text style={styles.instructionsText}>{goods.pickupInstructions}</Text>
            </View>
          )}
        </View>
      )}
      
      {/* QR Code */}
      {qrCodeDataURL && (
        <View style={styles.qrCodeContainer}>
          <Image style={styles.qrCode} src={qrCodeDataURL} />
          <Text style={styles.qrCodeLabel}>Scan for verification</Text>
        </View>
      )}
      
      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: THEME_COLORS.emerald[600] }]}>
        <Text style={styles.footerText}>Phoenix Prime Shipper - Pickup Documentation</Text>
        <Text style={[styles.footerText, { fontSize: 9 }]}>
          Job ID: {jobId} | Location {index + 1}
        </Text>
      </View>
    </Page>
  );
};

// Delivery Page Component  
const DeliveryPage = ({ delivery, index, jobData, jobId, packagingUnit, totalUnits, qrCodeDataURL }) => {
  const goods = jobData.deliveryGoods?.[index];
  const locationTitle = jobData.deliveries.length > 1 ? `DELIVERY LOCATION ${index + 1}` : 'DELIVERY LOCATION';
  const packageTitle = totalUnits > 1 
    ? `${packagingUnit.label.toUpperCase()} ${packagingUnit.unitIndex} OF ${packagingUnit.totalUnits}` 
    : 'DELIVERY DETAILS';
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: THEME_COLORS.red[600] }]}>
        <Text style={styles.headerText}>{locationTitle} - {packageTitle}</Text>
      </View>
      
      {/* Packaging Unit Information (if multiple units) */}
      {totalUnits > 1 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitleRed}>PACKAGING UNIT INFORMATION</Text>
          
          <View style={styles.gridRow}>
            <GridCell 
              label="Unit Type" 
              value={packagingUnit.label} 
              style={styles.gridCell}
              valueStyle={styles.fieldValue}
            />
            <GridCell 
              label="Unit Number" 
              value={`${packagingUnit.unitIndex} of ${packagingUnit.totalUnits}`} 
              style={styles.gridCell}
              valueStyle={styles.fieldValue}
            />
          </View>
          
          {packagingUnit.packageData && (
            <>
              {packagingUnit.packageData.weight && (
                <View style={styles.gridRow}>
                  <GridCell 
                    label="Unit Weight" 
                    value={`~${Math.round(packagingUnit.packageData.weight / packagingUnit.totalUnits * 100) / 100}kg`} 
                    style={styles.gridCell}
                    valueStyle={styles.fieldValue}
                  />
                  {packagingUnit.packageData.dimensions && (
                    <GridCell 
                      label="Dimensions" 
                      value={packagingUnit.packageData.dimensions} 
                      style={styles.gridCell}
                      valueStyle={styles.fieldValue}
                    />
                  )}
                </View>
              )}
              
              {/* Special attributes */}
              {(() => {
                const attributes = [];
                if (packagingUnit.packageData.secured) attributes.push('Secured');
                if (packagingUnit.packageData.fragile) attributes.push('Fragile');
                if (packagingUnit.packageData.hazardous) attributes.push('Hazardous');
                
                return attributes.length > 0 && (
                  <View style={styles.gridRow}>
                    <View style={[styles.gridCell, { flex: 2 }]}>
                      <Text style={styles.fieldLabel}>Special Handling:</Text>
                      <Text style={[styles.fieldValue, { color: THEME_COLORS.red[600] }]}>
                        {attributes.join(', ')}
                      </Text>
                    </View>
                  </View>
                );
              })()}
            </>
          )}
        </View>
      )}
      
      {/* Customer & Schedule Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitleRed}>CUSTOMER & SCHEDULE INFORMATION</Text>
        
        <View style={styles.gridRow}>
          <GridCell 
            label="Customer" 
            value={delivery.customerName || 'N/A'} 
            style={styles.gridCell}
            valueStyle={{ fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.purple[600] }}
          />
          <GridCell 
            label="Contact" 
            value={delivery.contactNumber || 'N/A'} 
            style={styles.gridCell}
            valueStyle={styles.fieldValueEmerald}
          />
        </View>
        
        <View style={styles.gridRow}>
          <View style={[styles.gridCell, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Address:</Text>
            <Text style={[styles.fieldValue, { color: THEME_COLORS.blue[800] }]}>
              {formatAddress(delivery.address)}
            </Text>
          </View>
        </View>
        
        <View style={styles.gridRow}>
          <GridCell 
            label="Date" 
            value={delivery.date || 'N/A'} 
            style={styles.gridCell}
            valueStyle={{ fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.red[500] }}
          />
          <GridCell 
            label="Time" 
            value={delivery.time || 'N/A'} 
            style={styles.gridCell}
            valueStyle={styles.fieldValueOrange}
          />
        </View>
        
        <View style={styles.gridRow}>
          <View style={[styles.gridCell, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Trading Hours:</Text>
            <Text style={[styles.fieldValue, { 
              color: delivery.tradingHours && delivery.tradingHours.includes('Closed') 
                ? THEME_COLORS.red[600] 
                : THEME_COLORS.emerald[800] 
            }]}>
              {delivery.tradingHours || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Instructions */}
      {delivery.instructions && (
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>SPECIAL INSTRUCTIONS:</Text>
          <Text style={styles.instructionsText}>{delivery.instructions}</Text>
        </View>
      )}
      
      {/* Appointment Details */}
      {delivery.appointmentDetails && (
        <View style={[styles.instructionsBox, { backgroundColor: THEME_COLORS.purple[50], borderColor: THEME_COLORS.purple[200] }]}>
          <Text style={[styles.instructionsTitle, { color: THEME_COLORS.purple[800] }]}>APPOINTMENT DETAILS:</Text>
          <Text style={[styles.instructionsText, { color: THEME_COLORS.purple[900] }]}>{delivery.appointmentDetails}</Text>
        </View>
      )}
      
      {/* Goods Information */}
      {goods && (
        <View style={styles.card}>
          <Text style={styles.sectionTitleRed}>GOODS INFORMATION</Text>
          
          {/* Calculate totals */}
          {(() => {
            const totalWeight = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
              return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
            }, 0) : 0;
            const totalItems = goods.packagingTypes ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
              return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
            }, 0) : 0;
            
            return (
              <>
                <View style={styles.gridRow}>
                  <GridCell 
                    label="Description" 
                    value={goods.description || 'N/A'} 
                    style={styles.gridCell}
                    valueStyle={{ fontSize: 8, fontWeight: 'bold', fontStyle: 'italic', color: THEME_COLORS.blue[600] }}
                  />
                  <GridCell 
                    label="Delivery Method" 
                    value={goods.deliveryMethod || 'N/A'} 
                    style={styles.gridCell}
                    valueStyle={getDeliveryMethodColor(goods.deliveryMethod)}
                  />
                </View>
                <View style={styles.gridRow}>
                  <GridCell 
                    label="Total Weight" 
                    value={`${totalWeight}kg`} 
                    style={styles.gridCell}
                    valueStyle={getWeightColor(totalWeight)}
                  />
                  <GridCell 
                    label="Total Items" 
                    value={`${totalItems} pieces`} 
                    style={styles.gridCell}
                    valueStyle={getItemCountColor(totalItems)}
                  />
                </View>
              </>
            );
          })()}
          
          {/* Current Unit Information (if multiple units) */}
          {totalUnits > 1 && packagingUnit.packageData && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.sectionTitleRed, { fontSize: 10, marginBottom: 6 }]}>
                CURRENT {packagingUnit.label.toUpperCase()} ({packagingUnit.unitIndex} OF {packagingUnit.totalUnits})
              </Text>
              {renderCurrentUnitDetails(packagingUnit.packageData, packagingUnit.totalUnits)}
            </View>
          )}
          
          {/* Packaging Details */}
          {goods.packagingTypes && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.sectionTitleRed, { fontSize: 10, marginBottom: 6 }]}>PACKAGING DETAILS</Text>
              {renderPackagingDetails(goods.packagingTypes, packagingUnit.type, totalUnits)}
            </View>
          )}
          
          {/* Special Instructions */}
          {goods.deliveryInstructions && (
            <View style={[styles.instructionsBox, { marginTop: 8 }]}>
              <Text style={styles.instructionsTitle}>DELIVERY INSTRUCTIONS:</Text>
              <Text style={styles.instructionsText}>{goods.deliveryInstructions}</Text>
            </View>
          )}
        </View>
      )}
      
      {/* QR Code */}
      {qrCodeDataURL && (
        <View style={styles.qrCodeContainer}>
          <Image style={styles.qrCode} src={qrCodeDataURL} />
          <Text style={styles.qrCodeLabel}>
            {totalUnits > 1 
              ? `${packagingUnit.label} ${packagingUnit.unitIndex}/${packagingUnit.totalUnits}`
              : 'Scan for verification'
            }
          </Text>
        </View>
      )}
      
      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: THEME_COLORS.red[600] }]}>
        <Text style={styles.footerText}>Phoenix Prime Shipper - Delivery Documentation</Text>
        <Text style={[styles.footerText, { fontSize: 9 }]}>
          {totalUnits > 1 
            ? `Job ID: ${jobId} | Location ${index + 1} | ${packagingUnit.label} ${packagingUnit.unitIndex}/${packagingUnit.totalUnits}`
            : `Job ID: ${jobId} | Location ${index + 1}`
          }
        </Text>
      </View>
    </Page>
  );
};

// Helper functions for styling
const getDeliveryMethodColor = (method) => {
  const methodLower = (method || '').toLowerCase();
  if (methodLower.includes('express')) {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.red[600] };
  } else if (methodLower.includes('standard')) {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.emerald[500] };
  } else if (methodLower.includes('priority')) {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.orange[600] };
  }
  return styles.fieldValue;
};

const getWeightColor = (weight) => {
  const weightNum = parseFloat(weight) || 0;
  if (weightNum > 1000) {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.red[600] };
  } else if (weightNum > 500) {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.orange[600] };
  } else {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.emerald[600] };
  }
};

const getItemCountColor = (items) => {
  const itemNum = parseInt(items) || 0;
  if (itemNum > 50) {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.purple[500] };
  } else {
    return { fontSize: 8, fontWeight: 'bold', color: THEME_COLORS.cyan[500] };
  }
};

// Render packaging details
const renderPackagingDetails = (packagingTypes, currentType = null, totalUnits = 1) => {
  const packagingTypeMap = {
    pallets: 'Pallets',
    boxes: 'Boxes', 
    bags: 'Bags',
    others: 'Loose Items'
  };
  
  const packagingItems = [];
  
  Object.entries(packagingTypeMap).forEach(([type, label]) => {
    const pkg = packagingTypes[type];
    if (pkg && pkg.selected) {
      const details = [];
      if (pkg.quantity) details.push(`${pkg.quantity} units`);
      if (pkg.weight) details.push(`${pkg.weight}kg`);
      if (pkg.dimensions) details.push(pkg.dimensions);
      
      const attributes = [];
      if (pkg.secured) attributes.push('Secured');
      if (pkg.fragile) attributes.push('Fragile');
      if (pkg.hazardous) attributes.push('Hazardous');
      
      // Mark current unit if applicable
      let displayLabel = label;
      if (currentType === type && totalUnits > 1) {
        displayLabel += ' ★';
      }
      
      packagingItems.push(
        <View key={type} style={styles.gridRow}>
          <View style={[styles.gridCell, { flex: 1.5 }]}>
            <Text style={[styles.fieldLabel, { color: THEME_COLORS.red[700] }]}>Type:</Text>
            <Text style={[styles.fieldValue, { color: THEME_COLORS.red[700] }]}>{displayLabel}</Text>
          </View>
          <View style={[styles.gridCell, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Details:</Text>
            <Text style={styles.fieldValue}>{details.join(' • ')}</Text>
          </View>
          <View style={[styles.gridCell, { flex: 1.5 }]}>
            <Text style={styles.fieldLabel}>Attributes:</Text>
            <Text style={styles.fieldValue}>{attributes.join(' • ') || 'Standard'}</Text>
          </View>
        </View>
      );
    }
  });
  
  return packagingItems;
};

// Render current unit details
const renderCurrentUnitDetails = (packageData, totalUnits) => {
  const details = [];
  
  if (packageData.weight) {
    const unitWeight = Math.round(packageData.weight / totalUnits * 100) / 100;
    details.push(
      <View key="weight" style={styles.gridRow}>
        <GridCell 
          label="Unit Weight" 
          value={`~${unitWeight}kg`} 
          style={styles.gridCell}
          valueStyle={styles.fieldValueRed}
        />
        {packageData.dimensions && (
          <GridCell 
            label="Dimensions" 
            value={packageData.dimensions} 
            style={styles.gridCell}
            valueStyle={styles.fieldValueRed}
          />
        )}
      </View>
    );
  }
  
  const characteristics = [];
  if (packageData.secured) characteristics.push('Secured');
  if (packageData.fragile) characteristics.push('Fragile');
  if (packageData.hazardous) characteristics.push('Hazardous');
  if (packageData.temperature) characteristics.push(`${packageData.temperature}°C`);
  
  if (characteristics.length > 0) {
    details.push(
      <View key="characteristics" style={styles.gridRow}>
        <View style={[styles.gridCell, { flex: 2 }]}>
          <Text style={styles.fieldLabel}>Characteristics:</Text>
          <Text style={[styles.fieldValue, { color: THEME_COLORS.red[600] }]}>
            {characteristics.join(' • ')}
          </Text>
        </View>
      </View>
    );
  }
  
  return details;
};

// Main PDF Document Component
const ShippingDocument = ({ jobData, jobId, otp, barcodeDataURL, qrCodeDataURLs }) => {
  // Generate packaging units for delivery pages
  const generatePackagingUnits = (deliveryIndex) => {
    const goods = jobData.deliveryGoods?.[deliveryIndex];
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
    
    // If no packaging units, create one default
    if (packagingUnits.length === 0) {
      packagingUnits.push({
        type: 'delivery',
        label: 'Delivery',
        unitIndex: 1,
        totalUnits: 1,
        packageData: null
      });
    }
    
    return packagingUnits;
  };
  
  return (
    <Document>
      {/* Summary Page */}
      <SummaryPage 
        jobData={jobData} 
        jobId={jobId} 
        otp={otp} 
        barcodeDataURL={barcodeDataURL}
      />
      
      {/* Pickup Pages */}
      {jobData.pickups && jobData.pickups.map((pickup, index) => (
        <PickupPage 
          key={`pickup-${index}`}
          pickup={pickup} 
          index={index} 
          jobData={jobData} 
          jobId={jobId}
          qrCodeDataURL={qrCodeDataURLs?.pickups?.[index]}
        />
      ))}
      
      {/* Delivery Pages */}
      {jobData.deliveries && jobData.deliveries.map((delivery, deliveryIndex) => {
        const packagingUnits = generatePackagingUnits(deliveryIndex);
        
        return packagingUnits.map((packagingUnit, unitIndex) => (
          <DeliveryPage 
            key={`delivery-${deliveryIndex}-unit-${unitIndex}`}
            delivery={delivery} 
            index={deliveryIndex} 
            jobData={jobData} 
            jobId={jobId}
            packagingUnit={packagingUnit}
            totalUnits={packagingUnits.length}
            qrCodeDataURL={qrCodeDataURLs?.deliveries?.[deliveryIndex]?.[unitIndex]}
          />
        ));
      })}
    </Document>
  );
};

// Function to pre-generate all QR codes and barcodes
const generateCodesForPDF = async (jobData, jobId) => {
  // Generate barcode for master document
  const barcodeDataURL = generateBarcodeDataURL(jobId);
  
  // Generate QR codes for pickups
  const pickupQRCodes = [];
  if (jobData.pickups) {
    for (let i = 0; i < jobData.pickups.length; i++) {
      const pickup = jobData.pickups[i];
      const qrData = JSON.stringify({
        type: 'PICKUP',
        jobId: jobId,
        locationIndex: i + 1,
        customer: pickup.customerName,
        date: pickup.date,
        time: pickup.time
      });
      const qrCodeDataURL = await generateQRCodeDataURL(qrData);
      pickupQRCodes.push(qrCodeDataURL);
    }
  }
  
  // Generate QR codes for deliveries  
  const deliveryQRCodes = [];
  if (jobData.deliveries) {
    for (let i = 0; i < jobData.deliveries.length; i++) {
      const delivery = jobData.deliveries[i];
      const goods = jobData.deliveryGoods?.[i];
      
      // Generate packaging units for this delivery
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
                totalUnits: pkg.quantity
              });
            }
          }
        });
      }
      
      // If no packaging units, create one default
      if (packagingUnits.length === 0) {
        packagingUnits.push({
          type: 'delivery',
          label: 'Delivery',
          unitIndex: 1,
          totalUnits: 1
        });
      }
      
      // Generate QR codes for each packaging unit
      const unitQRCodes = [];
      for (let unitIdx = 0; unitIdx < packagingUnits.length; unitIdx++) {
        const packagingUnit = packagingUnits[unitIdx];
        const qrData = JSON.stringify({
          type: 'DELIVERY',
          jobId: jobId,
          locationIndex: i + 1,
          packagingType: packagingUnit.type,
          packagingLabel: packagingUnit.label,
          unitNumber: packagingUnit.unitIndex,
          totalUnits: packagingUnit.totalUnits,
          customer: delivery.customerName,
          date: delivery.date,
          time: delivery.time
        });
        const qrCodeDataURL = await generateQRCodeDataURL(qrData);
        unitQRCodes.push(qrCodeDataURL);
      }
      deliveryQRCodes.push(unitQRCodes);
    }
  }
  
  return {
    barcodeDataURL,
    qrCodeDataURLs: {
      pickups: pickupQRCodes,
      deliveries: deliveryQRCodes
    }
  };
};

// Export functions
export const generateBookingPDF = async (jobData, jobId, otp) => {
  // Pre-generate all codes
  const codes = await generateCodesForPDF(jobData, jobId);
  
  return (
    <ShippingDocument 
      jobData={jobData} 
      jobId={jobId} 
      otp={otp}
      barcodeDataURL={codes.barcodeDataURL}
      qrCodeDataURLs={codes.qrCodeDataURLs}
    />
  );
};

export const downloadBookingPDF = async (jobData, jobId, otp) => {
  try {
    if (!jobData || !jobId || !otp) {
      throw new Error('Missing required data for PDF generation');
    }

    console.log('Generating comprehensive PDF with React PDF Renderer...');
    
    // Pre-generate all codes  
    const codes = await generateCodesForPDF(jobData, jobId);
    
    const doc = (
      <ShippingDocument 
        jobData={jobData} 
        jobId={jobId} 
        otp={otp}
        barcodeDataURL={codes.barcodeDataURL}
        qrCodeDataURLs={codes.qrCodeDataURLs}
      />
    );
    const blob = await pdf(doc).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Phoenix_Shipper_Complete_${jobId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Comprehensive PDF generated successfully');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    return false;
  }
};

// PDF Download Link Component for direct use in React
export const PDFDownloadComponent = ({ jobData, jobId, otp, fileName, children }) => (
  <PDFDownloadLink
    document={<ShippingDocument jobData={jobData} jobId={jobId} otp={otp} />}
    fileName={fileName || `Phoenix_Shipper_Complete_${jobId}.pdf`}
  >
    {({ blob, url, loading, error }) =>
      loading ? 'Generating PDF...' : (children || 'Download PDF')
    }
  </PDFDownloadLink>
);

export default ShippingDocument;