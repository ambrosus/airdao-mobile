import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: Number.MAX_SAFE_INTEGER,
    position: 'relative'
  },
  innerRelativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
