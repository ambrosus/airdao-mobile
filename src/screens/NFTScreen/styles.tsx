import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  headerBorder: {
    borderColor: COLORS.neutral900Alpha['5'],
    borderBottomWidth: 1
  },
  shadows: { shadowColor: 'transparent' },
  centerAlign: {
    width: '100%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    paddingTop: 0,
    width: '100%',
    height: '100%'
  },
  NFTContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '70%',
    width: '100%',
    borderRadius: 20
  },
  errorContainer: {
    paddingHorizontal: 15,
    height: '60%'
  }
});
