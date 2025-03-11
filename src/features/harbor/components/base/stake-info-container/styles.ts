import { StyleSheet } from 'react-native';
import { contentBox } from '@components/styles';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    ...contentBox,
    backgroundColor: COLORS.neutral0,
    padding: scale(16)
  },
  topText: {
    fontSize: scale(14)
  },
  bottomText: {
    fontSize: scale(12)
  },
  infoMain: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 16,
    padding: scale(10),
    rowGap: 12
  }
});
