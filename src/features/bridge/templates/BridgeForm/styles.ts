import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainerWitHeading: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 8
  },
  disabledInputContainer: {
    zIndex: 1000,
    position: 'absolute'
  },
  button: {
    marginTop: scale(16)
  }
});
