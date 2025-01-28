import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: { shadowColor: 'transparent' },
  wrapper: { paddingHorizontal: scale(28) },
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
  mnemonic: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    width: '50%',
    height: 43,
    paddingHorizontal: scale(20),
    backgroundColor: COLORS.neutral100
  },
  contentContainerStyle: {
    gap: 8
  }
});
