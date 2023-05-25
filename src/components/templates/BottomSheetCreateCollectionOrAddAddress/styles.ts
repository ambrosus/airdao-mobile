import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(18)
  },
  swiperIcon: { alignSelf: 'center', paddingTop: verticalScale(16) },
  addAddressButton: {
    backgroundColor: COLORS.electricBlue,
    width: '90%',
    alignSelf: 'center'
  },
  createCollectionButton: {
    backgroundColor: COLORS.charcoal,
    width: '90%',
    alignSelf: 'center'
  }
});
