import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16
  },
  header: {
    paddingHorizontal: scale(16)
  }
});
