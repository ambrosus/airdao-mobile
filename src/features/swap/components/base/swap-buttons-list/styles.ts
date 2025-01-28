import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(24)
  },
  multiStepButton: {
    width: '46.5%',
    height: 48
  },
  button: {
    height: 48
  },
  pendingLayout: {
    columnGap: scale(8)
  }
});
