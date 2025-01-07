import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 1
  },
  spinnerWrapper: { paddingVertical: scale(36), alignItems: 'center' }
});
