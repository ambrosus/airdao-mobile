import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: scale(10)
  },
  main: {
    paddingHorizontal: scale(16),
    height: '35%'
  }
});
