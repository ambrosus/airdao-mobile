import { StyleSheet } from 'react-native';
import { scale, verticalScale, isSmallScreen } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(20)
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
    rowGap: 8,
    paddingBottom: isSmallScreen ? scale(100) : 0
  }
});
