import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  heading: {
    textAlign: 'center'
  },
  tokensListWrapper: {
    maxHeight: '100%'
  },
  container: {
    paddingHorizontal: scale(24)
  }
});
