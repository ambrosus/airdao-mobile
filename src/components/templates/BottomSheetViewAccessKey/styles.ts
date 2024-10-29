import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  title: { paddingTop: scale(16) },
  main: {
    paddingHorizontal: scale(16),
    height: '35%'
  }
});
