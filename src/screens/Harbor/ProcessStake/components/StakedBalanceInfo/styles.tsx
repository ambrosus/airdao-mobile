import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { contentBox } from '@components/styles';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    ...contentBox
  },
  textStyle: {
    color: COLORS.neutral900,
    fontSize: scale(14)
  }
});
