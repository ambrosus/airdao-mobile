import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: '25%'
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(48)
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
    borderRadius: 1000,
    paddingVertical: verticalScale(8),
    paddingLeft: scale(18),
    paddingRight: scale(16)
  }
});
