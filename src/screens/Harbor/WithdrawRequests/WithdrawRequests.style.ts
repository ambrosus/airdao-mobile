import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  main: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral100
  },
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(40)
  },
  list: {
    flex: 1,
    paddingBottom: scale(200)
  },
  listContainer: {
    paddingTop: scale(12),
    paddingBottom: verticalScale(50),
    paddingHorizontal: scale(12)
  }
});
