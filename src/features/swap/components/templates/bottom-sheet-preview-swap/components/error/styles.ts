import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  description: {
    maxWidth: 343
  },
  footer: {
    width: '100%',
    rowGap: verticalScale(16),
    paddingTop: verticalScale(40)
  },
  secondaryButton: {
    backgroundColor: COLORS.primary50
  }
});
