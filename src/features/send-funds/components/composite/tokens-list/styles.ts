import { StyleSheet } from 'react-native';
import { DEVICE_HEIGHT } from '@constants/variables';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  loader: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    maxHeight: DEVICE_HEIGHT / 2.25
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16)
  }
});
