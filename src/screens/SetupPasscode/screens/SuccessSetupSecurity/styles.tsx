import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(27)
  },
  button: {
    paddingHorizontal: scale(16),
    height: scale(54)
  }
});
