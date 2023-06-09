import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  header: {
    paddingTop: verticalScale(24),
    paddingHorizontal: scale(24)
  },
  container: {
    marginHorizontal: scale(18)
  },
  image: {
    flex: 1
  },
  highlightTitle: {
    maxWidth: 180
  }
});
