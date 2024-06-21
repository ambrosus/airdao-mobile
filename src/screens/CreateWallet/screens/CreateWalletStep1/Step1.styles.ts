import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
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
