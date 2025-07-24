import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, THEME_COLORS, LAYOUT_CONSTANTS } from '../styles/theme';
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
    backgroundColor: THEME_COLORS.purple[50],
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    marginRight: 8,
  },
  
  sectionTitle: {
    ...baseStyles.subtitle,
    fontSize: LAYOUT_CONSTANTS.fontSize.medium,
    marginBottom: 0,
    color: THEME_COLORS.purple[800],
  },
  
  sectionSubtitle: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.purple[600],
    marginLeft: 24,
  },
  
  gridContainer: {
    ...baseStyles.gridContainer,
  },
  
  gridRow: {
    ...baseStyles.gridRow,
  },
  
  specialServicesContainer: {
    marginTop: LAYOUT_CONSTANTS.sectionSpacing,
    paddingTop: LAYOUT_CONSTANTS.headerSpacing,
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.slate[200],
  },
  
  specialServicesTitle: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    fontWeight: 'bold',
    color: THEME_COLORS.slate[700],
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.cyan[50],
    borderWidth: 1,
    borderColor: THEME_COLORS.cyan[200],
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    padding: 8,
    marginBottom: 6,
  },
  
  serviceIcon: {
    width: 12,
    height: 12,
    backgroundColor: THEME_COLORS.cyan[200],
    borderRadius: 6,
    marginRight: 8,
  },
  
  serviceText: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.cyan[800],
    fontWeight: 'bold',
  },
  
  serviceDescription: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small - 1,
    color: THEME_COLORS.cyan[600],
    marginLeft: 20,
  }
});

const VehicleInfoGrid = ({ vehicle = {}, jobData = {} }) => {
  // Default values
  const vehicleData = {
    name: vehicle.name || 'Van (1T)',
    capacity: vehicle.capacity || '1 Tonne',
    maxWeight: vehicle.maxWeight || '1',
    pallets: vehicle.pallets || '2',
    bodyType: jobData.truckBodyType || 'Pantech',
    isRefrigerated: jobData.isRefrigerated || false,
  };

  const hasSpecialServices = vehicleData.isRefrigerated || jobData.craneHiabOption;

  return (
    <View style={styles.sectionContainer}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerIcon} />
        <View>
          <Text style={styles.sectionTitle}>Vehicle & Service</Text>
          <Text style={styles.sectionSubtitle}>Transportation details</Text>
        </View>
      </View>
      
      {/* 2x3 Grid */}
      <View style={styles.gridContainer}>
        {/* First Row */}
        <View style={styles.gridRow}>
          <GridCell
            label="Vehicle:"
            value={vehicleData.name}
            backgroundColor={THEME_COLORS.orange[50]}
            borderColor={THEME_COLORS.orange[200]}
            valueColor={THEME_COLORS.orange[600]}
          />
          <GridCell
            label="Capacity:"
            value={vehicleData.capacity}
            backgroundColor={THEME_COLORS.cyan[50]}
            borderColor={THEME_COLORS.cyan[200]}
            valueColor={THEME_COLORS.cyan[600]}
            isLast={true}
          />
        </View>
        
        {/* Second Row */}
        <View style={styles.gridRow}>
          <GridCell
            label="Max Weight:"
            value={`${vehicleData.maxWeight} tonnes`}
            backgroundColor={THEME_COLORS.slate[50]}
            borderColor={THEME_COLORS.slate[200]}
            valueColor={THEME_COLORS.cyan[600]}
          />
          <GridCell
            label="Pallet Capacity:"
            value={`${vehicleData.pallets} Pallets`}
            backgroundColor={THEME_COLORS.cyan[50]}
            borderColor={THEME_COLORS.cyan[200]}
            valueColor={THEME_COLORS.cyan[600]}
            isLast={true}
          />
        </View>
        
        {/* Third Row */}
        <View style={styles.gridRow}>
          <GridCell
            label="Body Type:"
            value={vehicleData.bodyType}
            backgroundColor={THEME_COLORS.purple[50]}
            borderColor={THEME_COLORS.purple[200]}
            valueColor={THEME_COLORS.purple[600]}
          />
          <GridCell
            label="Refrigeration:"
            value={vehicleData.isRefrigerated ? 'Required' : 'Not Required'}
            backgroundColor={THEME_COLORS.slate[50]}
            borderColor={THEME_COLORS.slate[200]}
            valueColor={vehicleData.isRefrigerated ? THEME_COLORS.emerald[600] : THEME_COLORS.slate[400]}
            isLast={true}
          />
        </View>
      </View>
      
      {/* Special Services Section */}
      {hasSpecialServices && (
        <View style={styles.specialServicesContainer}>
          <Text style={styles.specialServicesTitle}>Special Services</Text>
          
          {vehicleData.isRefrigerated && (
            <View style={styles.serviceItem}>
              <View style={styles.serviceIcon} />
              <View>
                <Text style={styles.serviceText}>Refrigerated Transport</Text>
                <Text style={styles.serviceDescription}>Temperature-controlled cargo handling</Text>
              </View>
            </View>
          )}
          
          {jobData.craneHiabOption && (
            <View style={[styles.serviceItem, {
              backgroundColor: THEME_COLORS.orange[50],
              borderColor: THEME_COLORS.orange[200],
            }]}>
              <View style={[styles.serviceIcon, { backgroundColor: THEME_COLORS.orange[200] }]} />
              <View>
                <Text style={[styles.serviceText, { color: THEME_COLORS.orange[800] }]}>
                  {jobData.craneHiabOption === 'crane' ? 'Crane Service' : 'Hiab Service'}
                </Text>
                <Text style={[styles.serviceDescription, { color: THEME_COLORS.orange[600] }]}>
                  {jobData.craneHiabOption === 'crane' 
                    ? 'Heavy lifting capability' 
                    : 'Hydraulic arm loading/unloading'
                  }
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default VehicleInfoGrid;