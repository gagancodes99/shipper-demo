import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, THEME_COLORS, LAYOUT_CONSTANTS } from '../styles/theme';

const styles = StyleSheet.create({
  headerContainer: {
    ...baseStyles.header,
    backgroundColor: THEME_COLORS.primary.blue600,
    color: THEME_COLORS.white,
    padding: 16,
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    marginBottom: LAYOUT_CONSTANTS.sectionSpacing,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: LAYOUT_CONSTANTS.fontSize.header,
    fontWeight: 'bold',
    color: THEME_COLORS.white,
  },
  
  headerSubtitle: {
    fontSize: LAYOUT_CONSTANTS.fontSize.normal,
    color: THEME_COLORS.white,
    marginTop: 4,
  },
  
  headerRight: {
    alignItems: 'flex-end',
  },
  
  confirmationBadge: {
    backgroundColor: THEME_COLORS.emerald[500],
    color: THEME_COLORS.white,
    padding: 6,
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  dateText: {
    color: THEME_COLORS.white,
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    marginTop: 4,
  }
});

const DocumentHeader = ({ title, subtitle, showConfirmed = true }) => {
  const currentDate = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <View>
          <Text style={styles.headerTitle}>PHOENIX PRIME SHIPPER</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.headerRight}>
        {showConfirmed && (
          <Text style={styles.confirmationBadge}>CONFIRMED</Text>
        )}
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
    </View>
  );
};

export default DocumentHeader;