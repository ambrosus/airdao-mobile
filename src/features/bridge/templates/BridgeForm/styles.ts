import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%'
  },
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
  inputContainerWithSelector: {
    position: 'relative',
    width: '100%',
    height: 48
  },
  inputCurrencySelector: {
    position: 'absolute',
    zIndex: 999,
    top: 12,
    left: scale(12)
  },
  input: {
    textAlign: 'right'
  },
  information: {
    width: '100%',
    rowGap: 8
  },
  button: {
    marginTop: scale(16)
  }
});
