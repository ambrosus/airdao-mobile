import { StyleSheet } from 'react-native';
import { moderateScale, scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: scale(14),
    height: 32,
    justifyContent: 'center',
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(87, 76, 255, 0.16)',
    position: 'relative'
  },
  triangleContainer: {
    alignSelf: 'center',
    zIndex: -999
  }
});
