import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseStyles, THEME_COLORS, LAYOUT_CONSTANTS } from '../styles/theme';

const styles = StyleSheet.create({
  cellContainer: {
    ...baseStyles.gridCell,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  labelText: {
    ...baseStyles.label,
    position: 'absolute',
    top: 6,
    left: 8,
    fontSize: LAYOUT_CONSTANTS.fontSize.small - 1,
  },
  
  valueText: {
    fontSize: LAYOUT_CONSTANTS.fontSize.medium,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  
  iconContainer: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 12,
    height: 12,
  }
});

const GridCell = ({ 
  label, 
  value, 
  backgroundColor = THEME_COLORS.slate[50], 
  borderColor = THEME_COLORS.slate[200],
  valueColor = THEME_COLORS.slate[800],
  isLast = false,
  icon = null
}) => {
  const cellStyle = [
    styles.cellContainer,
    {
      backgroundColor,
      borderColor,
    },
    isLast && baseStyles.gridCellLast
  ];

  return (
    <View style={cellStyle}>
      <Text style={styles.labelText}>{label}</Text>
      
      <Text style={[styles.valueText, { color: valueColor }]}>
        {value}
      </Text>
      
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
    </View>
  );
};

export default GridCell;