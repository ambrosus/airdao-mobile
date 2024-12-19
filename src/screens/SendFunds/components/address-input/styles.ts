import { verticalScale } from '@utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    rowGap: verticalScale(8)
  },
  touchableHandlerArea: {
    width: '100%',
    height: 60,
    position: 'absolute',
    top: 15,
    zIndex: 100
  }
});
