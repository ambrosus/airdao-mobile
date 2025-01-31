import { StyleSheet } from 'react-native';
import { isAndroidXsScreen, isSmallScreen, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {},
  details: {
    marginTop: verticalScale(isSmallScreen ? 10 : 32),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(isAndroidXsScreen ? 10 : 20),
    borderRadius: 16,
    backgroundColor: 'rgba(88, 94, 119, 0.08)',
    rowGap: verticalScale(isAndroidXsScreen ? 6 : 16)
  }
});
