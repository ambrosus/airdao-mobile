import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  selectedMnemonicContainer: {
    minHeight: verticalScale(172),
    paddingVertical: verticalScale(16),
    backgroundColor: COLORS.alphaBlack5,
    borderColor: COLORS.neutral200,
    borderWidth: 1,
    marginHorizontal: scale(16),
    borderRadius: moderateScale(16)
  },
  mnemoicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: verticalScale(20),
    width: scale(342),
    height: 120,
    alignSelf: 'center',
    alignItems: 'center',
    columnGap: scale(20)
  },
  mnemonic: {
    width: scale(94),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    borderRadius: 1000,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    height: verticalScale(36),
    minHeight: 36
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: verticalScale(12)
  }
});
