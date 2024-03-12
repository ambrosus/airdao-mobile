import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const stylesStep0 = StyleSheet.create({
  flexStyle: { flex: 1 },
  container: {
    width: '100%'
  },
  createText: { maxWidth: scale(330) },
  buttonTextStyle: { marginVertical: scale(12) }
});
