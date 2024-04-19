import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(16)
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  column: {
    flex: 1
  },
  mnemonic: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    height: verticalScale(36),
    minHeight: 36
  }
});
