import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import {
  RECT_HEIGHT,
  RECT_WIDTH,
  TRIANGLE_HEIGHT,
  TRIANGLE_WIDTH
} from '@entities/kosmos';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99999
  },
  tooltipContainer: {
    ...(Platform.OS === 'android' && {
      borderWidth: 0.5,
      borderColor: COLORS.neutral200
    }),
    shadowColor: '#C2C5CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
    width: RECT_WIDTH,
    height: RECT_HEIGHT,
    backgroundColor: COLORS.neutral0,
    borderRadius: 8,
    padding: 12,
    position: 'absolute',
    rowGap: 4
  },
  tooltipText: {
    color: '#000'
  },
  triangle: {
    ...(Platform.OS === 'ios' && {
      shadowColor: '#C2C5CC',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 1
    }),
    width: 0,
    height: 0,
    borderLeftWidth: TRIANGLE_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightWidth: TRIANGLE_HEIGHT,
    borderRightColor: 'transparent',
    borderTopWidth: TRIANGLE_WIDTH,
    borderTopColor: Platform.select({
      android: 'white',
      ios: 'white'
    }),
    position: 'absolute',
    ...(Platform.OS === 'android' && {
      borderWidth: 2, // Adjust the stroke width as needed
      borderColor: 'black', // Adjust the stroke color as needed
      borderStyle: 'solid',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: 'white',
      // This ensures the border is visible without affecting the triangle's shape
      transform: [{ translateY: -1 }, { translateX: -1 }]
    })
  }
});
