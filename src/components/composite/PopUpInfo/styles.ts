import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  popoverStyle: {
    borderRadius: scale(4),
    padding: scale(8)
  },
  container: {
    backgroundColor: '#C2C5CC',
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(12),
    height: scale(12),
    borderRadius: scale(8)
  }
});
