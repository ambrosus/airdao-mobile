import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    paddingTop: verticalScale(32),
    justifyContent: 'space-between'
  },
  input: {
    shadowColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10,
    color: COLORS.alphaBlack60
  },
  addressContainer: {
    marginTop: scale(15),
    borderRadius: 24,
    paddingVertical: scale(25),
    backgroundColor: COLORS.neutral50,
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
  copyAddressButtonWrapper: {
    marginTop: verticalScale(16),
    height: 33
  },
  copyButton: {
    backgroundColor: COLORS.brand100,
    borderRadius: 1000,
    alignSelf: 'center',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12)
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(24)
  },
  accessKeysButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(24)
  },
  footer: {
    flexDirection: 'column',
    rowGap: scale(24)
  }
});
