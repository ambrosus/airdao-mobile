import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.brand600,
    borderRadius: 50,
    padding: 5
  },
  buttonWrapper: {
    width: '45%',
    padding: scale(14),
    borderRadius: scale(16),
    alignItems: 'flex-start',
    backgroundColor: COLORS.neutral50
  },
  buttonContainer: { paddingHorizontal: scale(16) },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
