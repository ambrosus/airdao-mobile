import { StyleSheet } from 'react-native';
import { DEVICE_HEIGHT } from '@constants/variables';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: DEVICE_HEIGHT * 0.4,
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    margin: 5,
    height: DEVICE_HEIGHT * 0.08
  },
  btnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: scale(20)
  }
});
