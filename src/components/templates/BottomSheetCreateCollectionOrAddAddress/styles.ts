import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginHorizontal: 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32
  },
  swiperIcon: { alignSelf: 'center', paddingTop: verticalScale(16) },
  addNewAddressButton: {
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
