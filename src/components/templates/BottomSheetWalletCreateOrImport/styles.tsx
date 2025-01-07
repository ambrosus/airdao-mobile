import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  buttonWrapper: {
    width: '45%',
    padding: scale(14),
    borderRadius: scale(16),
    alignItems: 'flex-start',
    backgroundColor: COLORS.neutral50
  },
  buttonContainer: { paddingHorizontal: scale(16) },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  closeButtonContainer: {
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(3)
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
