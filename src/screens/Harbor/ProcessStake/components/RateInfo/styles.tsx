import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { contentBox } from '@components/styles';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    ...contentBox,
    backgroundColor: COLORS.neutral100
  },
  title: {
    fontSize: scale(14),
    color: COLORS.neutral600
  },
  text: {
    fontSize: scale(12),
    color: COLORS.neutral900
  }
});
