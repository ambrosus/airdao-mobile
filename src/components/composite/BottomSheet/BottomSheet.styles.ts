import { Dimensions, StyleSheet } from 'react-native';

const Screen = Dimensions.get('window');

export const styles = StyleSheet.create({
  fullScreen: {
    zIndex: 1000,
    height: Screen.height,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: Screen.width / 2,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  backdrop: {
    position: 'absolute',
    height: Screen.height,
    width: Screen.width
  },
  container: {
    width: Screen.width,
    position: 'absolute',
    backgroundColor: '#FFFFFF'
  }
});
