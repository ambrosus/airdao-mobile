import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    paddingTop: scale(8),
    paddingHorizontal: scale(12)
  },
  stakeInfoText: {
    paddingHorizontal: scale(2),
    paddingTop: scale(8),
    paddingBottom: scale(16)
  }
});
