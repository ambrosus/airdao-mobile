import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  main: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.brand200
  },
  title: {
    fontSize: 16
  },
  data: {
    color: COLORS.black
  }
});
