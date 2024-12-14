import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: scale(16),
    height: '100%'
  },
  container: {
    justifyContent: 'space-between',
    height: '85%'
  }
});
