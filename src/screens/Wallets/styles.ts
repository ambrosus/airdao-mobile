import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { Dimensions, StyleSheet } from 'react-native';

const homeTabsContainerHeight = Dimensions.get('screen').height * 0.44;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f5f7',
    paddingBottom: '25%'
  },
  homeTabs: {
    paddingHorizontal: scale(10),
    marginHorizontal: scale(16),
    backgroundColor: 'white',
    borderRadius: 24,
    height: homeTabsContainerHeight
  },
  homeHighlights: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginHorizontal: scale(16)
  },
  divider: {
    height: 2,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#2f2b431a',
    marginVertical: verticalScale(24)
  },
  airdao: {
    marginTop: verticalScale(32)
  },
  floatButtonTitle: {
    fontFamily: 'Inter_600SemiBold'
  },
  addAddressBtn: {
    backgroundColor: COLORS.deepBlue,
    paddingVertical: verticalScale(8),
    paddingLeft: scale(18),
    paddingRight: scale(16)
  }
});
