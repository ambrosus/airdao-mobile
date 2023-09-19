import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  createWalletStep2Container: {
    flex: 1
  },
  word: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 48
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    alignItems: 'center',
    alignSelf: 'center'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  words: {
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    rowGap: scale(20),
    columnGap: verticalScale(20),
    flexDirection: 'row'
  },
  mnemoicContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    borderColor: COLORS.neutral100,
    borderWidth: 2,
    backgroundColor: COLORS.alphaBlack5,
    width: '90%',
    height: verticalScale(172),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16)
  },
  mnemoicContainerColumn: {
    width: '33%',
    alignItems: 'center',
    flex: 1
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%'
  },
  mnemoicLogo: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightSilver,
    borderRadius: 100,
    width: scale(193),
    height: verticalScale(192)
  }
});
