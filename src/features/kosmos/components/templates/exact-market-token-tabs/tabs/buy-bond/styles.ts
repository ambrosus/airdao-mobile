import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  innerContainer: {
    marginHorizontal: scale(16.5)
  },
  inputWithHeadingContainer: {
    marginTop: 16,
    rowGap: 8
  },
  inputLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  },
  input: {
    textAlign: 'right',
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral900
  },
  balance: {
    marginTop: verticalScale(8)
  },
  details: {
    marginTop: verticalScale(24),
    rowGap: 8
  },
  footer: {
    marginTop: verticalScale(234),
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral100
  },
  button: {
    paddingHorizontal: scale(16)
  }
});
