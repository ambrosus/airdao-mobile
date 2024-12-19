import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

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
  mnemoicLogo: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral100,
    borderRadius: verticalScale(96),
    width: verticalScale(192),
    height: verticalScale(192)
  }
});
