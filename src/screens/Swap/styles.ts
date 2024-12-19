import { scale } from '@utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    flex: 1,
    paddingHorizontal: scale(16),
    justifyContent: 'space-between'
  }
});
