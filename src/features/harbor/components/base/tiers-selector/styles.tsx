import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { contentBox } from '@components/styles';

export const styles = StyleSheet.create({
  wrapper: {
    ...contentBox,
    backgroundColor: COLORS.neutral0,
    paddingVertical: scale(16)
  }
});
