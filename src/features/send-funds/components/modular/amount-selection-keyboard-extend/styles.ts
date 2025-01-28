import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
    zIndex: 9999
  },
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
