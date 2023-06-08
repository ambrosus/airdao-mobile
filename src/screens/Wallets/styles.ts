import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f5f7',
    paddingBottom: verticalScale(126)
  },
  homeTabs: {
    marginHorizontal: scale(16),
    backgroundColor: 'white',
    borderRadius: 24
  },
  homeHighlights: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginHorizontal: scale(16),
    paddingBottom: verticalScale(28)
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
