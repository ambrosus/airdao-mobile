import { StyleSheet } from 'react-native';
import { contentBox } from '@components/styles';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    ...contentBox,
    padding: scale(16),
    backgroundColor: COLORS.neutral100
  }
});
