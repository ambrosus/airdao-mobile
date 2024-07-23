import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loader: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '95%',
    backgroundColor: 'white',
    zIndex: 9999
  },
  innerLoader: {
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
