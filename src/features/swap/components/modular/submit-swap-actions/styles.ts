import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(24)
  },
  multiStepButton: {
    width: '46.5%'
  }
});
