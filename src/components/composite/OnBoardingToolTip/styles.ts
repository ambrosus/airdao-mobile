import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  content: {
    margin: 12
  },
  buttonRight: {
    backgroundColor: COLORS.brand100,
    borderRadius: 25,
    alignSelf: 'flex-start'
  },
  buttonText: {
    marginHorizontal: 12,
    marginVertical: 6
  },
  buttonLeft: {
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15
  },
  title: {},
  subtitle: {}
});
