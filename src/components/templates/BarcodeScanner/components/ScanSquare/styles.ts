import { StyleSheet } from 'react-native';
import { isSmallScreen, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    height: isSmallScreen ? '60%' : '70%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer: {
    position: 'relative',
    width: scale(308),
    height: verticalScale(308)
  },
  corner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderWidth: 4,
    borderColor: '#FFD700'
  },
  topLeft: {
    top: -2, // Slight adjustments for alignment
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 24
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 24
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 24
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 24
  }
});
