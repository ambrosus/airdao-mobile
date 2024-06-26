import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    paddingTop: verticalScale(32),
    justifyContent: 'space-between'
  },
  nameInput: {
    marginHorizontal: scale(16)
  },
  input: {
    shadowColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10,
    color: COLORS.alphaBlack60
  },
  addressContainer: {
    paddingHorizontal: scale(24),
    alignSelf: 'center'
  },
  qrCode: {
    alignSelf: 'center',
    backgroundColor: COLORS.neutral0,
    padding: moderateScale(18),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: COLORS.neutral100
  },
  copyButton: {
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: 1000,
    alignSelf: 'center',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12)
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(24)
  },
  accessKeysButton: {
    backgroundColor: COLORS.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(24)
  },
  footer: {
    flexDirection: 'column',
    rowGap: scale(24)
  }
});
