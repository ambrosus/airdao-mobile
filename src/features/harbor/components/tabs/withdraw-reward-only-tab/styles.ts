import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: scale(16),
    height: '100%',
    justifyContent: 'space-between'
  },
  buttonWrapper: { paddingBottom: scale(50) }
});
