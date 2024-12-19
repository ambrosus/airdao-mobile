import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: -10,
    marginBottom: -20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.neutral900
  },
  bottomSheet: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
  }
});
