import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: scale(12),
    justifyContent: 'space-between'
  },
  buttonWrapper: { paddingBottom: scale(20) }
});
