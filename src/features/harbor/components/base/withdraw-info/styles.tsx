import { StyleSheet } from 'react-native';
import { contentBox } from '@components/styles';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    ...contentBox,
    backgroundColor: COLORS.neutral100,
    paddingVertical: scale(12)
  }
});
