import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: verticalScale(16),
    paddingHorizontal: scale(24)
  },
  innerContainer: {
    gap: verticalScale(16)
  },
  heading: {
    textAlign: 'center'
  },
  tokenRow: {
    gap: 4
  },
  amountRow: {
    gap: 8
  },
  footerShareButton: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    backgroundColor: COLORS.neutral100
  }
});
