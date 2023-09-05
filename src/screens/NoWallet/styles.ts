import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stepContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(24)
  },
  buttons: {
    paddingHorizontal: scale(16)
  }
});
