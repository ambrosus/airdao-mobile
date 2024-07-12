import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemLabelContainer: {
    columnGap: 8
  },
  logo: {
    width: scale(24),
    height: scale(24)
  }
});
