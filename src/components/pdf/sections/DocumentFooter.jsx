import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, THEME_COLORS, LAYOUT_CONSTANTS } from '../styles/theme';

const styles = StyleSheet.create({
  footerContainer: {
    ...baseStyles.footer,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.slate[100],
    borderTopWidth: 2,
    borderTopColor: THEME_COLORS.slate[300],
  },
  
  footerLeft: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.slate[600],
  },
  
  footerCenter: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.slate[600],
    fontWeight: 'bold',
  },
  
  footerRight: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.slate[600],
  }
});

const DocumentFooter = ({ 
  jobId, 
  pageType = 'Master Documentation', 
  locationIndex = null,
  packageInfo = null 
}) => {
  const getFooterText = () => {
    let footerText = `Phoenix Prime Shipper - ${pageType}`;
    
    if (locationIndex !== null) {
      footerText += ` | Location ${locationIndex + 1}`;
    }
    
    if (packageInfo) {
      footerText += ` | ${packageInfo.label} ${packageInfo.unitIndex}/${packageInfo.totalUnits}`;
    }
    
    return footerText;
  };

  return (
    <View style={styles.footerContainer} fixed>
      <Text style={styles.footerLeft}>
        {getFooterText()}
      </Text>
      
      <Text style={styles.footerCenter}>
        Job ID: {jobId}
      </Text>
      
      <Text style={styles.footerRight} render={({ pageNumber, totalPages }) => 
        `Page ${pageNumber} of ${totalPages}`
      } />
    </View>
  );
};

export default DocumentFooter;