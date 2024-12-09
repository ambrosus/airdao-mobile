import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { contentBox } from '@components/styles';

export const styles = StyleSheet.create({
  main: {
    ...contentBox,
    padding: scale(16)
  }
});
