import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, THEME_COLORS, LAYOUT_CONSTANTS } from '../styles/theme';

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
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    marginRight: 8,
  },
  
  sectionTitle: {
    ...baseStyles.subtitle,
    fontSize: LAYOUT_CONSTANTS.fontSize.medium,
    marginBottom: 0,
  },
  
  table: {
    ...baseStyles.table,
  },
  
  tableHeader: {
    ...baseStyles.tableRow,
    ...baseStyles.tableHeader,
    borderBottomWidth: 2,
    borderBottomColor: THEME_COLORS.slate[300],
  },
  
  tableRow: {
    ...baseStyles.tableRow,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.slate[200],
    minHeight: 24,
  },
  
  tableCell: {
    ...baseStyles.tableCell,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  
  headerCell: {
    ...baseStyles.tableCell,
    fontWeight: 'bold',
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.slate[700],
    backgroundColor: THEME_COLORS.slate[100],
    paddingVertical: 8,
    textAlign: 'center',
  },
  
  // Column width styles
  customerColumn: {
    width: '18%',
  },
  
  addressColumn: {
    width: '22%',
  },
  
  scheduleColumn: {
    width: '15%',
  },
  
  contactColumn: {
    width: '12%',
  },
  
  goodsColumn: {
    width: '15%',
  },
  
  packagingColumn: {
    width: '18%',
  },
  
  // Pickup specific styles
  pickupHeader: {
    backgroundColor: THEME_COLORS.emerald[100],
    borderColor: THEME_COLORS.emerald[200],
  },
  
  pickupTitle: {
    color: THEME_COLORS.emerald[800],
  },
  
  pickupHeaderIcon: {
    backgroundColor: THEME_COLORS.emerald[200],
  },
  
  // Delivery specific styles
  deliveryHeader: {
    backgroundColor: THEME_COLORS.red[100],
    borderColor: THEME_COLORS.red[200],
  },
  
  deliveryTitle: {
    color: THEME_COLORS.red[800],
  },
  
  deliveryHeaderIcon: {
    backgroundColor: THEME_COLORS.red[200],
  },
});

// Helper function to format address
const formatAddress = (address) => {
  if (!address) return 'No address provided';
  return `${address.address}, ${address.suburb} ${address.postcode}`;
};

// Helper function to format packaging
const formatPackaging = (packagingTypes) => {
  if (!packagingTypes) return 'No packaging';
  
  const items = [];
  const pt = packagingTypes;
  
  if (pt?.pallets?.selected) {
    items.push(`${pt.pallets.quantity || 0} Pallets (${pt.pallets.weight || 0}kg)`);
  }
  if (pt?.boxes?.selected) {
    items.push(`${pt.boxes.quantity || 0} Boxes (${pt.boxes.weight || 0}kg)`);
  }
  if (pt?.bags?.selected) {
    items.push(`${pt.bags.quantity || 0} Bags (${pt.bags.weight || 0}kg)`);
  }
  if (pt?.others?.selected) {
    items.push(`${pt.others.quantity || 0} Items (${pt.others.weight || 0}kg)`);
  }
  
  return items.length > 0 ? items.join(', ') : 'No packaging';
};

const LocationsTable = ({ 
  locations = [], 
  goods = [], 
  type = 'pickup', // 'pickup' or 'delivery'
  title 
}) => {
  const isPickup = type === 'pickup';
  const isDelivery = type === 'delivery';
  
  // Headers based on type
  const pickupHeaders = ['Customer', 'Address', 'Schedule', 'Contact', 'Goods', 'Packaging', 'Instructions'];
  const deliveryHeaders = ['Customer', 'Address', 'Schedule', 'Trading Hours', 'Goods', 'Method', 'Packaging', 'Instructions'];
  
  const headers = isPickup ? pickupHeaders : deliveryHeaders;
  
  // Style configuration based on type
  const headerStyle = isPickup ? styles.pickupHeader : styles.deliveryHeader;
  const titleStyle = isPickup ? styles.pickupTitle : styles.deliveryTitle;
  const iconStyle = isPickup ? styles.pickupHeaderIcon : styles.deliveryHeaderIcon;
  
  const getColumnStyle = (index) => {
    const baseColumnStyles = [
      styles.customerColumn,
      styles.addressColumn,
      styles.scheduleColumn,
      isPickup ? styles.contactColumn : styles.contactColumn, // Trading Hours for delivery
      styles.goodsColumn,
      isPickup ? styles.packagingColumn : styles.contactColumn, // Method for delivery
    ];
    
    if (!isPickup && index >= 5) {
      // Delivery has extra columns
      return index === 6 ? styles.packagingColumn : styles.contactColumn;
    }
    
    return baseColumnStyles[index] || styles.contactColumn;
  };

  const renderRow = (location, index) => {
    const locationGoods = goods?.[index];
    
    const pickupCells = [
      `${index + 1}. ${location.customerName || 'N/A'}`,
      formatAddress(location.address),
      `${location.date || 'N/A'} at ${location.time || 'N/A'}`,
      location.recipientMobile || 'N/A',
      locationGoods?.description || 'N/A',
      formatPackaging(locationGoods?.packagingTypes),
      location.instructions || ''
    ];
    
    const deliveryCells = [
      `${index + 1}. ${location.customerName || 'N/A'}`,
      formatAddress(location.address),
      `${location.date || 'N/A'} at ${location.time || 'N/A'}`,
      location.tradingHours || 'N/A',
      locationGoods?.description || 'N/A',
      locationGoods?.deliveryMethod || 'N/A',
      formatPackaging(locationGoods?.packagingTypes),
      location.instructions || ''
    ];
    
    const cells = isPickup ? pickupCells : deliveryCells;
    
    return (
      <View key={index} style={styles.tableRow}>
        {cells.map((cell, cellIndex) => (
          <View 
            key={cellIndex} 
            style={[
              styles.tableCell, 
              getColumnStyle(cellIndex),
              cellIndex === cells.length - 1 && baseStyles.tableCellLast
            ]}
          >
            <Text style={{ fontSize: LAYOUT_CONSTANTS.fontSize.small - 1 }}>
              {cell}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <View style={[styles.sectionContainer, headerStyle]}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.headerIcon, iconStyle]} />
        <Text style={[styles.sectionTitle, titleStyle]}>
          {title || `${type.toUpperCase()} LOCATIONS`}
        </Text>
      </View>
      
      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          {headers.map((header, index) => (
            <View 
              key={index} 
              style={[
                styles.headerCell, 
                getColumnStyle(index),
                index === headers.length - 1 && baseStyles.tableCellLast
              ]}
            >
              <Text>{header}</Text>
            </View>
          ))}
        </View>
        
        {/* Table Rows */}
        {locations.map((location, index) => renderRow(location, index))}
      </View>
    </View>
  );
};

export default LocationsTable;