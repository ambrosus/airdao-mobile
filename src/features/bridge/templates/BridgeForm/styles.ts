import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%'
  },
  container: {
    flex: 1
  },
  separatedContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  inputContainerWitHeading: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 8
  },
  disabledInputContainer: {
    zIndex: 1000,
    opacity: 0.7,
    position: 'absolute',
    width: '100%',
    height: '50%',
    backgroundColor: COLORS.neutral0
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
