import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// Simple test styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  }
});

const TestPDFDocument = ({ jobData, jobId, otp }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Phoenix Prime Shipper - Test PDF</Text>
          <Text style={styles.text}>Job ID: {jobId}</Text>
          <Text style={styles.text}>OTP: {otp}</Text>
          <Text style={styles.text}>Job Type: {jobData?.jobType || 'Not specified'}</Text>
          <Text style={styles.text}>Vehicle: {jobData?.vehicle?.name || 'Not specified'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.title}>Pickup Locations</Text>
          {jobData?.pickups?.length > 0 ? (
            jobData.pickups.map((pickup, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {pickup.customerName || 'Unknown'} - {pickup.address?.address || 'No address'}
              </Text>
            ))
          ) : (
            <Text style={styles.text}>No pickup locations</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.title}>Delivery Locations</Text>
          {jobData?.deliveries?.length > 0 ? (
            jobData.deliveries.map((delivery, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {delivery.customerName || 'Unknown'} - {delivery.address?.address || 'No address'}
              </Text>
            ))
          ) : (
            <Text style={styles.text}>No delivery locations</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default TestPDFDocument;