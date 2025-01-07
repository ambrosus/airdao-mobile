import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16.5)
  },
  header: {
    paddingLeft: 0,
    paddingRight: 0
  },
  leftContainerStyles: {
    left: scale(16.5)
  },
  rightContainerStyles: {
    right: scale(16.5)
  }
});
