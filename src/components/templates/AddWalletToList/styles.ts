import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  list: {
    paddingHorizontal: scale(21)
  }
});
