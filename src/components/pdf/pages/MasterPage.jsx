import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { baseStyles, THEME_COLORS } from '../styles/theme';
import DocumentHeader from '../sections/DocumentHeader';
import DocumentFooter from '../sections/DocumentFooter';
import JobDetailsGrid from '../sections/JobDetailsGrid';
import VehicleInfoGrid from '../sections/VehicleInfoGrid';
import LocationsTable from '../sections/LocationsTable';

const MasterPage = ({ jobData, jobId, otp }) => {
  return (
    <Page size="A4" style={baseStyles.page}>
      {/* Header */}
      <DocumentHeader 
        title="PHOENIX PRIME SHIPPER"
        subtitle="MASTER DOCUMENTATION"
        showConfirmed={true}
      />
      
      {/* Booking Confirmed Message */}
      <View style={baseStyles.section}>
        <View style={{
          textAlign: 'center',
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: THEME_COLORS.emerald[600],
            marginBottom: 8,
          }}>
            Booking Confirmed
          </Text>
          <Text style={{
            fontSize: 12,
            color: THEME_COLORS.slate[600],
          }}>
            Your shipping request has been confirmed
          </Text>
        </View>
      </View>
      
      {/* Job Details Grid */}
      <JobDetailsGrid 
        jobId={jobId}
        otp={otp}
        status="Confirmed"
        jobType={jobData.jobType}
      />
      
      {/* Vehicle Information Grid */}
      <VehicleInfoGrid 
        vehicle={jobData.vehicle}
        jobData={jobData}
      />
      
      {/* Pickup Locations Table */}
      {jobData.pickups && jobData.pickups.length > 0 && (
        <LocationsTable
          locations={jobData.pickups}
          goods={jobData.pickupGoods}
          type="pickup"
          title="PICKUP LOCATIONS"
        />
      )}
      
      {/* Delivery Locations Table */}
      {jobData.deliveries && jobData.deliveries.length > 0 && (
        <LocationsTable
          locations={jobData.deliveries}
          goods={jobData.deliveryGoods}
          type="delivery"
          title="DELIVERY LOCATIONS"
        />
      )}
      
      {/* Footer */}
      <DocumentFooter 
        jobId={jobId}
        pageType="Master Documentation"
      />
    </Page>
  );
};

export default MasterPage;