import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  popup: {
    width: 123
  },
  popover: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    width: Dimensions.get('screen').width - 100
  },
  content: {
    margin: 12
  },
  buttonRight: {
    backgroundColor: '#0e0e0e0d',
    borderRadius: 25,
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
  },
  buttonText: {
    marginHorizontal: 12,
    marginVertical: 6
  },
  buttonLeft: {
    backgroundColor: '#0e0e0e0d',
    borderRadius: 25,
    alignItems: 'flex-start',
    alignSelf: 'flex-start'
  },
  title: {},
  subtitle: {}
});
