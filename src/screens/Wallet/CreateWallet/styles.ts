import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent'
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(18),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  createWalletStep2Container: {
    flex: 1
  },
  word: {
    backgroundColor: '#E6E6E6',
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
    rowGap: scale(16),
    columnGap: verticalScale(16),
    flexDirection: 'row'
  },
  mnemoicContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    borderColor: COLORS.gray100,
    borderWidth: 2,
    backgroundColor: COLORS.charcoal,
    width: '90%',
    height: verticalScale(232),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20)
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
  }
});
