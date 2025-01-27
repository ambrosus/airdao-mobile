import { StyleSheet } from 'react-native';
import { isSmallScreen, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {},
  details: {
    marginTop: verticalScale(isSmallScreen ? 12 : 32),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    borderRadius: 16,
    backgroundColor: 'rgba(88, 94, 119, 0.08)',
    rowGap: verticalScale(isSmallScreen ? 8 : 16)
  }
});
