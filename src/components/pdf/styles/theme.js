import { StyleSheet } from '@react-pdf/renderer';

// Convert RGB arrays to hex for @react-pdf/renderer
const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Convert THEME_COLORS from PDFGenerator.js to @react-pdf format
const convertThemeColors = (themeColors) => {
  const converted = {};
  
  for (const [colorName, colorValues] of Object.entries(themeColors)) {
    if (Array.isArray(colorValues)) {
      // Handle single color arrays like white: [255, 255, 255]
      converted[colorName] = rgbToHex(...colorValues);
    } else if (typeof colorValues === 'object') {
      // Handle nested color objects like blue: { 50: [240, 249, 255], ... }
      converted[colorName] = {};
      for (const [shade, rgbArray] of Object.entries(colorValues)) {
        converted[colorName][shade] = rgbToHex(...rgbArray);
      }
    }
  }
  
  return converted;
};

// Original theme colors from PDFGenerator.js
const ORIGINAL_THEME_COLORS = {
  primary: {
    blue500: [59, 130, 246],
    blue600: [37, 99, 235],
    purple600: [147, 51, 234],
  },
  blue: {
    50: [240, 249, 255],
    100: [219, 234, 254],
    200: [191, 219, 254],
    300: [147, 197, 253],
    500: [59, 130, 246],
    600: [37, 99, 235],
    700: [29, 78, 216],
    800: [30, 64, 175],
    900: [30, 58, 138],
  },
  emerald: {
    100: [209, 250, 229],
    200: [167, 243, 208],
    500: [16, 185, 129],
    600: [5, 150, 105],
    700: [4, 120, 87],
    800: [6, 95, 70],
  },
  red: {
    100: [254, 226, 226],
    200: [252, 165, 165],
    500: [239, 68, 68],
    600: [220, 38, 127],
    700: [185, 28, 28],
    800: [153, 27, 27],
  },
  purple: {
    50: [250, 245, 255],
    200: [221, 214, 254],
    600: [147, 51, 234],
    800: [109, 40, 217],
    900: [88, 28, 135],
  },
  orange: {
    50: [255, 247, 237],
    100: [255, 237, 213],
    200: [254, 215, 170],
    500: [249, 115, 22],
    600: [234, 88, 12],
    700: [194, 65, 12],
  },
  slate: {
    50: [248, 250, 252],
    100: [241, 245, 249],
    200: [226, 232, 240],
    300: [203, 213, 225],
    400: [148, 163, 184],
    500: [100, 116, 139],
    600: [71, 85, 105],
    700: [51, 65, 85],
    800: [30, 41, 59],
    900: [15, 23, 42],
  },
  amber: {
    50: [255, 251, 235],
    100: [254, 243, 199],
    200: [253, 230, 138],
    800: [146, 64, 14],
  },
  cyan: {
    50: [236, 254, 255],
    100: [207, 250, 254],
    200: [165, 243, 252],
    500: [6, 182, 212],
    600: [8, 145, 178],
  },
  indigo: {
    50: [238, 242, 255],
  },
  white: [255, 255, 255],
};

// Convert to hex colors for @react-pdf
export const THEME_COLORS = convertThemeColors(ORIGINAL_THEME_COLORS);

// Layout constants
export const LAYOUT_CONSTANTS = {
  pageMargin: 20,
  cardPadding: 12,
  rowHeight: 20,
  gridGap: 8,
  sectionSpacing: 24,
  headerSpacing: 16,
  fontSize: {
    small: 8,
    normal: 10,
    medium: 12,
    large: 14,
    title: 16,
    header: 18
  },
  borderRadius: 4,
  borderWidth: 1,
};

// Base styles for common elements
export const baseStyles = StyleSheet.create({
  page: {
    padding: LAYOUT_CONSTANTS.pageMargin,
    backgroundColor: THEME_COLORS.white,
    fontFamily: 'Helvetica',
    fontSize: LAYOUT_CONSTANTS.fontSize.normal,
    lineHeight: 1.4,
  },
  
  // Typography
  title: {
    fontSize: LAYOUT_CONSTANTS.fontSize.title,
    fontWeight: 'bold',
    color: THEME_COLORS.slate[800],
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: LAYOUT_CONSTANTS.fontSize.medium,
    fontWeight: 'bold',
    color: THEME_COLORS.slate[700],
    marginBottom: 6,
  },
  
  body: {
    fontSize: LAYOUT_CONSTANTS.fontSize.normal,
    color: THEME_COLORS.slate[600],
    lineHeight: 1.5,
  },
  
  label: {
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    fontWeight: 'bold',
    color: THEME_COLORS.slate[500],
    textTransform: 'uppercase',
  },
  
  // Layout containers
  section: {
    marginBottom: LAYOUT_CONSTANTS.sectionSpacing,
  },
  
  card: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    borderWidth: LAYOUT_CONSTANTS.borderWidth,
    borderColor: THEME_COLORS.slate[200],
    padding: LAYOUT_CONSTANTS.cardPadding,
    marginBottom: 12,
  },
  
  // Grid layouts
  gridContainer: {
    flexDirection: 'column',
  },
  
  gridRow: {
    flexDirection: 'row',
    marginBottom: LAYOUT_CONSTANTS.gridGap,
  },
  
  gridCell: {
    flex: 1,
    marginRight: LAYOUT_CONSTANTS.gridGap,
    padding: 8,
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
    borderWidth: 0.5,
    minHeight: 40,
  },
  
  gridCellLast: {
    marginRight: 0,
  },
  
  // Header and footer
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: LAYOUT_CONSTANTS.sectionSpacing,
    borderBottomWidth: 2,
    borderBottomColor: THEME_COLORS.slate[200],
  },
  
  footer: {
    position: 'absolute',
    bottom: LAYOUT_CONSTANTS.pageMargin,
    left: LAYOUT_CONSTANTS.pageMargin,
    right: LAYOUT_CONSTANTS.pageMargin,
    textAlign: 'center',
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.slate[400],
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.slate[200],
    paddingTop: 8,
  },
  
  // Table styles
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: THEME_COLORS.slate[200],
    borderRadius: LAYOUT_CONSTANTS.borderRadius,
  },
  
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  
  tableHeader: {
    backgroundColor: THEME_COLORS.slate[100],
    fontWeight: 'bold',
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    color: THEME_COLORS.slate[700],
  },
  
  tableCell: {
    margin: 'auto',
    padding: 6,
    fontSize: LAYOUT_CONSTANTS.fontSize.small,
    borderRightWidth: 1,
    borderRightColor: THEME_COLORS.slate[200],
    textAlign: 'left',
  },
  
  tableCellLast: {
    borderRightWidth: 0,
  },
});

// Color-specific styles for different sections
export const colorStyles = StyleSheet.create({
  // Job details colors
  jobIdCell: {
    backgroundColor: THEME_COLORS.slate[50],
    borderColor: THEME_COLORS.slate[200],
  },
  
  otpCell: {
    backgroundColor: THEME_COLORS.blue[50],
    borderColor: THEME_COLORS.blue[200],
  },
  
  statusCell: {
    backgroundColor: THEME_COLORS.emerald[100],
    borderColor: THEME_COLORS.emerald[200],
  },
  
  typeCell: {
    backgroundColor: THEME_COLORS.purple[50],
    borderColor: THEME_COLORS.purple[200],
  },
  
  // Vehicle info colors
  vehicleCell: {
    backgroundColor: THEME_COLORS.orange[50],
    borderColor: THEME_COLORS.orange[200],
  },
  
  capacityCell: {
    backgroundColor: THEME_COLORS.cyan[50],
    borderColor: THEME_COLORS.cyan[200],
  },
  
  // Pickup/delivery colors
  pickupSection: {
    backgroundColor: THEME_COLORS.emerald[100],
    borderColor: THEME_COLORS.emerald[200],
  },
  
  deliverySection: {
    backgroundColor: THEME_COLORS.red[100],
    borderColor: THEME_COLORS.red[200],
  },
});

export default {
  THEME_COLORS,
  LAYOUT_CONSTANTS,
  baseStyles,
  colorStyles,
};