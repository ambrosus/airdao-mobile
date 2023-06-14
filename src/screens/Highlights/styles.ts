import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent'
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.nero
  },
  container: {
    paddingHorizontal: scale(18)
  }
});
