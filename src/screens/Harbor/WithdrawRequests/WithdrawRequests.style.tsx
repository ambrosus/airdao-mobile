import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  loader: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: { flex: 1 },
  listContainer: {
    paddingTop: scale(12),
    backgroundColor: COLORS.neutral100,
    paddingHorizontal: scale(12)
  }
});
