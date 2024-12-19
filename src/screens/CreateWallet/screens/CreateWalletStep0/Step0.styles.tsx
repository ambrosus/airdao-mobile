import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const stylesStep0 = StyleSheet.create({
  flexStyle: { flex: 1, alignItems: 'center' },
  container: {
    width: '100%'
  },
  createText: { maxWidth: '90%' },
  buttonTextStyle: { marginVertical: scale(12) }
});
