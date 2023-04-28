import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 132
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 25,
    backgroundColor: COLORS.deepBlue
  },
  text: {
    paddingLeft: 10
  }
});
