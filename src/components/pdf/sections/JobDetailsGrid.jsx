import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, colorStyles, THEME_COLORS, LAYOUT_CONSTANTS } from '../styles/theme';
import GridCell from './GridCell';

const styles = StyleSheet.create({
  sectionContainer: {
    ...baseStyles.section,
    ...baseStyles.card,
    padding: LAYOUT_CONSTANTS.cardPadding,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: LAYOUT_CONSTANTS.headerSpacing,
  },
  
  headerIcon: {
    width: 16,
    height: 16,
    backgroundColor: THEME_COLORS.indigo[50],
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    marginRight: 8,
  },
  
  sectionTitle: {
    ...baseStyles.subtitle,
    fontSize: LAYOUT_CONSTANTS.fontSize.medium,
    marginBottom: 0,
  },
  
  sectionSubtitle: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.slate[600],
    marginLeft: 24,
  },
  
  gridContainer: {
    ...baseStyles.gridContainer,
  },
  
  gridRow: {
    ...baseStyles.gridRow,
  }
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

const JobDetailsGrid = ({ jobId, otp, status = 'Confirmed', jobType }) => {
  return (
    <View style={styles.sectionContainer}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerIcon} />
        <View>
          <Text style={styles.sectionTitle}>Master Documentation</Text>
          <Text style={styles.sectionSubtitle}>Job reference and details</Text>
        </View>
      </View>
      
      {/* 2x2 Grid */}
      <View style={styles.gridContainer}>
        {/* First Row */}
        <View style={styles.gridRow}>
          <GridCell
            label="Job ID:"
            value={jobId}
            backgroundColor={THEME_COLORS.slate[50]}
            borderColor={THEME_COLORS.slate[200]}
            valueColor={THEME_COLORS.purple[600]}
          />
          <GridCell
            label="OTP:"
            value={otp.toString()}
            backgroundColor={THEME_COLORS.blue[50]}
            borderColor={THEME_COLORS.blue[200]}
            valueColor={THEME_COLORS.blue[600]}
            isLast={true}
          />
        </View>
        
        {/* Second Row */}
        <View style={styles.gridRow}>
          <GridCell
            label="Status:"
            value={status}
            backgroundColor={THEME_COLORS.emerald[100]}
            borderColor={THEME_COLORS.emerald[200]}
            valueColor={THEME_COLORS.emerald[600]}
          />
          <GridCell
            label="Type:"
            value={getJobTypeLabel(jobType)}
            backgroundColor={THEME_COLORS.purple[50]}
            borderColor={THEME_COLORS.purple[200]}
            valueColor={THEME_COLORS.purple[600]}
            isLast={true}
          />
        </View>
      </View>
    </View>
  );
};

export default JobDetailsGrid;