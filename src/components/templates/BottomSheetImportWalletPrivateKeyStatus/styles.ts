import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24)
  },
  innerContainer: {
    alignItems: 'center'
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  headingLineHeight: {
    lineHeight: 30
  }
});
