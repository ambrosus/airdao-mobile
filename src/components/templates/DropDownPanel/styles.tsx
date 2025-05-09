import { StyleSheet } from 'react-native';
import { contentBox } from '@components/styles';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    ...contentBox,
    padding: 0,
    paddingHorizontal: scale(8),
    backgroundColor: COLORS.neutral0,
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    width: 24,
    height: 24
  }
});
