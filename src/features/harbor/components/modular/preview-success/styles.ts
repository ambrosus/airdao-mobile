import { StyleSheet } from 'react-native';
import { contentBox } from '@components/styles';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  contentWrapper: {
    ...contentBox,
    paddingHorizontal: scale(16),
    width: '100%'
  },
  listWrapper: { paddingTop: scale(8) }
});
