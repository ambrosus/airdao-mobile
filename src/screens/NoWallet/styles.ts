import { Dimensions, StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stepContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width,
    marginTop: verticalScale(80)
    // paddingHorizontal: scale(24)
  },
  buttons: {
    flex: 1,
    paddingHorizontal: scale(16)
  }
});
