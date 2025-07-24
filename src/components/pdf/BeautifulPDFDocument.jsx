import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';

// Professional styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e40af', // blue-800
    color: '#ffffff',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  
  headerLeft: {
    flexDirection: 'column',
  },
  
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.9,
  },
  
  confirmedBadge: {
    backgroundColor: '#059669', // emerald-600
    color: '#ffffff',
    padding: '8 12',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Job details grid
  jobDetailsSection: {
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151', // gray-700
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb', // gray-200
    paddingBottom: 6,
  },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  gridItem: {
    flex: '1 1 45%',
    backgroundColor: '#f8fafc', // slate-50
    borderWidth: 1,
    borderColor: '#cbd5e1', // slate-300
    borderRadius: 6,
    padding: 12,
    minHeight: 50,
  },
  
  gridLabel: {
    fontSize: 9,
    color: '#64748b', // slate-500
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  
  gridValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b', // slate-800
  },
  
  // Special styling for different data types
  jobIdGrid: {
    backgroundColor: '#faf5ff', // purple-50
    borderColor: '#d8b4fe', // purple-300
  },
  
  jobIdValue: {
    color: '#7c3aed', // purple-600
  },
  
  otpGrid: {
    backgroundColor: '#eff6ff', // blue-50
    borderColor: '#93c5fd', // blue-300
  },
  
  otpValue: {
    color: '#2563eb', // blue-600
  },
  
  statusGrid: {
    backgroundColor: '#ecfdf5', // emerald-50
    borderColor: '#6ee7b7', // emerald-300
  },
  
  statusValue: {
    color: '#059669', // emerald-600
  },
  
  // Vehicle section
  vehicleSection: {
    marginBottom: 20,
    backgroundColor: '#fefbff', // purple-25 (custom)
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff', // purple-200
  },
  
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  
  vehicleItem: {
    flex: '1 1 30%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 6,
    padding: 10,
    minHeight: 45,
  },
  
  // Table styles
  tableSection: {
    marginBottom: 20,
  },
  
  tableContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 6,
    overflow: 'hidden',
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6', // gray-100
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db', // gray-300
    paddingVertical: 8,
  },
  
  tableHeaderCell: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151', // gray-700
    textAlign: 'center',
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // gray-200
    paddingVertical: 6,
  },
  
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 9,
    color: '#4b5563', // gray-600
    textAlign: 'left',
  },
  
  // Pickup table styling
  pickupSection: {
    backgroundColor: '#ecfdf5', // emerald-50
    borderColor: '#6ee7b7', // emerald-300
  },
  
  pickupHeader: {
    backgroundColor: '#d1fae5', // emerald-100
  },
  
  pickupTitle: {
    color: '#065f46', // emerald-800
  },
  
  // Delivery table styling
  deliverySection: {
    backgroundColor: '#fef2f2', // red-50
    borderColor: '#fca5a5', // red-300
  },
  
  deliveryHeader: {
    backgroundColor: '#fee2e2', // red-100
  },
  
  deliveryTitle: {
    color: '#991b1b', // red-800
  },
  
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // gray-200
    paddingTop: 10,
    fontSize: 8,
    color: '#6b7280', // gray-500
  },
  
  // QR Code and Barcode containers
  codeContainer: {
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9fafb', // gray-50
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
  },
  
  codeLabel: {
    fontSize: 8,
    color: '#6b7280', // gray-500
    marginTop: 4,
  },
  
  // Mock QR and barcode placeholders
  mockQR: {
    width: 60,
    height: 60,
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  
  mockBarcode: {
    width: 120,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
});

// Helper function to get job type label
const getJobTypeLabel = (jobType) => {
  const labels = {
    'single': 'Single Pickup/Drop',
    'multi-pickup': 'Multi-Pickup', 
    'multi-drop': 'Multi-Drop'
  };
  return labels[jobType] || jobType;
};

// Helper function to format address
const formatAddress = (address) => {
  if (!address) return 'No address provided';
  return `${address.address}, ${address.suburb} ${address.postcode}`;
};

const BeautifulPDFDocument = ({ jobData, jobId, otp }) => {
  const currentDate = new Date().toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Professional Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>PHOENIX PRIME SHIPPER</Text>
            <Text style={styles.headerSubtitle}>Master Documentation</Text>
          </View>
          <View>
            <Text style={styles.confirmedBadge}>CONFIRMED</Text>
          </View>
        </View>

        {/* Booking Confirmed Message */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#059669', marginBottom: 6 }}>
            Booking Confirmed
          </Text>
          <Text style={{ fontSize: 11, color: '#6b7280' }}>
            Your shipping request has been confirmed - {currentDate}
          </Text>
        </View>

        {/* Job Details Grid */}
        <View style={styles.jobDetailsSection}>
          <Text style={styles.sectionTitle}>Job Reference & Details</Text>
          <View style={styles.gridContainer}>
            <View style={[styles.gridItem, styles.jobIdGrid]}>
              <Text style={styles.gridLabel}>Job ID</Text>
              <Text style={[styles.gridValue, styles.jobIdValue]}>{jobId}</Text>
            </View>
            
            <View style={[styles.gridItem, styles.otpGrid]}>
              <Text style={styles.gridLabel}>Driver OTP</Text>
              <Text style={[styles.gridValue, styles.otpValue]}>{otp}</Text>
            </View>
            
            <View style={[styles.gridItem, styles.statusGrid]}>
              <Text style={styles.gridLabel}>Status</Text>
              <Text style={[styles.gridValue, styles.statusValue]}>Confirmed</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Job Type</Text>
              <Text style={[styles.gridValue, { color: '#7c3aed' }]}>
                {getJobTypeLabel(jobData?.jobType)}
              </Text>
            </View>
          </View>
        </View>

        {/* Master Barcode */}
        <View style={styles.codeContainer}>
          <View style={styles.mockBarcode} />
          <Text style={styles.codeLabel}>Master Shipment Barcode - {jobId}</Text>
        </View>

        {/* Vehicle Information */}
        <View style={styles.vehicleSection}>
          <Text style={[styles.sectionTitle, { color: '#7c3aed' }]}>Vehicle & Service Details</Text>
          <View style={styles.vehicleGrid}>
            <View style={styles.vehicleItem}>
              <Text style={styles.gridLabel}>Vehicle</Text>
              <Text style={[styles.gridValue, { color: '#ea580c' }]}>
                {jobData?.vehicle?.name || 'Van (1T)'}
              </Text>
            </View>
            
            <View style={styles.vehicleItem}>
              <Text style={styles.gridLabel}>Capacity</Text>
              <Text style={[styles.gridValue, { color: '#0891b2' }]}>
                {jobData?.vehicle?.capacity || '1 Tonne'}
              </Text>
            </View>
            
            <View style={styles.vehicleItem}>
              <Text style={styles.gridLabel}>Max Weight</Text>
              <Text style={[styles.gridValue, { color: '#0891b2' }]}>
                {jobData?.vehicle?.maxWeight || '1'} tonnes
              </Text>
            </View>
            
            <View style={styles.vehicleItem}>
              <Text style={styles.gridLabel}>Pallet Capacity</Text>
              <Text style={[styles.gridValue, { color: '#0891b2' }]}>
                {jobData?.vehicle?.pallets || '2'} Pallets
              </Text>
            </View>
            
            <View style={styles.vehicleItem}>
              <Text style={styles.gridLabel}>Body Type</Text>
              <Text style={[styles.gridValue, { color: '#7c3aed' }]}>
                {jobData?.truckBodyType || 'Pantech'}
              </Text>
            </View>
            
            <View style={styles.vehicleItem}>
              <Text style={styles.gridLabel}>Refrigeration</Text>
              <Text style={[styles.gridValue, { color: jobData?.isRefrigerated ? '#059669' : '#6b7280' }]}>
                {jobData?.isRefrigerated ? 'Required' : 'Not Required'}
              </Text>
            </View>
          </View>
        </View>

        {/* Pickup Locations Table */}
        {jobData?.pickups && jobData.pickups.length > 0 && (
          <View style={[styles.tableSection, styles.pickupSection]}>
            <Text style={[styles.sectionTitle, styles.pickupTitle]}>Pickup Locations</Text>
            <View style={styles.tableContainer}>
              <View style={[styles.tableHeader, styles.pickupHeader]}>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Customer</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Address</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Schedule</Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Contact</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Instructions</Text>
              </View>
              
              {jobData.pickups.map((pickup, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>
                    {index + 1}. {pickup.customerName || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {formatAddress(pickup.address)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {pickup.date || 'N/A'} at {pickup.time || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>
                    {pickup.recipientMobile || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>
                    {pickup.instructions || ''}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* QR Code for pickups */}
            <View style={styles.codeContainer}>
              <View style={styles.mockQR} />
              <Text style={styles.codeLabel}>Pickup Verification QR Code</Text>
            </View>
          </View>
        )}

        {/* Delivery Locations Table */}
        {jobData?.deliveries && jobData.deliveries.length > 0 && (
          <View style={[styles.tableSection, styles.deliverySection]}>
            <Text style={[styles.sectionTitle, styles.deliveryTitle]}>Delivery Locations</Text>
            <View style={styles.tableContainer}>
              <View style={[styles.tableHeader, styles.deliveryHeader]}>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Customer</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Address</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Schedule</Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.9 }]}>Trading Hours</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Instructions</Text>
              </View>
              
              {jobData.deliveries.map((delivery, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>
                    {index + 1}. {delivery.customerName || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {formatAddress(delivery.address)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {delivery.date || 'N/A'} at {delivery.time || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>
                    {delivery.tradingHours || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>
                    {delivery.instructions || ''}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* QR Code for deliveries */}
            <View style={styles.codeContainer}>
              <View style={styles.mockQR} />
              <Text style={styles.codeLabel}>Delivery Verification QR Code</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Phoenix Prime Shipper - Master Documentation | Job ID: {jobId}</Text>
          <Text render={({ pageNumber, totalPages }) => 
            `Page ${pageNumber} of ${totalPages}`
          } />
        </View>
      </Page>
    </Document>
  );
};

export default BeautifulPDFDocument;