import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 54,
    backgroundColor: 'rgba(209, 213, 219, 0.9)',
    justifyContent: 'center'
  },
  innerRow: {
    width: '100%',
    columnGap: scale(18)
  }
});
