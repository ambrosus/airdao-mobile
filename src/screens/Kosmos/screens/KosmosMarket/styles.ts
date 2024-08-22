import { DEVICE_HEIGHT } from '@constants/variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loader: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: DEVICE_HEIGHT > 800 ? '97%' : '90%',
    backgroundColor: 'white',
    zIndex: 9999
  }
});
