import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  loader: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 9999
  }
});
