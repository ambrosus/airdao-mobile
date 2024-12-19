import { StyleSheet } from 'react-native';
import { contentBox } from '@components/styles';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  toolTipContainerStyle: {
    borderRadius: 8,
    backgroundColor: COLORS.asphaltBlack
  },
  wrapper: {
    ...contentBox,
    backgroundColor: COLORS.neutral0,
    paddingVertical: scale(16)
  }
});
