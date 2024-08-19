import {
  RECT_WIDTH,
  RECT_HEIGHT,
  TRIANGLE_HEIGHT,
  TRIANGLE_WIDTH
} from '@features/kosmos/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99999
  },
  tooltipContainer: {
    shadowColor: '#C2C5CC',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
    width: RECT_WIDTH,
    height: RECT_HEIGHT,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    position: 'absolute',
    rowGap: 4
  },
  tooltipText: {
    color: '#000'
  },
  triangle: {
    shadowColor: '#C2C5CC',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
    width: 0,
    height: 0,
    borderLeftWidth: TRIANGLE_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightWidth: TRIANGLE_HEIGHT,
    borderRightColor: 'transparent',
    borderTopWidth: TRIANGLE_WIDTH,
    borderTopColor: 'white',
    position: 'absolute'
  }
});
