import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16
  },
  header: {
    paddingHorizontal: scale(16)
  }
});
