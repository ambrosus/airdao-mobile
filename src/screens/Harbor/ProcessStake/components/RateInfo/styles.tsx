import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { contentBox } from '@components/styles';

export const styles = StyleSheet.create({
  main: {
    ...contentBox
  },
  title: {
    color: COLORS.neutral600
  },
  text: {
    color: COLORS.neutral900
  }
});
