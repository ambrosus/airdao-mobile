import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    padding: scale(16)
  },
  item: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
