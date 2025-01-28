import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 16
  },
  container: {
    borderWidth: scale(1),
    borderColor: COLORS.neutral200,
    borderRadius: scale(16),
    marginBottom: scale(10),
    padding: scale(8),
    paddingHorizontal: scale(16),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {},
  itemTitle: {
    paddingLeft: scale(12)
  }
});
