import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separatedContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  inputContainerWitHeading: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 8
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
  }
});
