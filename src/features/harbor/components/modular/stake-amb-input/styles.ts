import { StyleSheet } from 'react-native';
import { isSmallScreen, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(isSmallScreen ? 6 : 12)
  }
});
