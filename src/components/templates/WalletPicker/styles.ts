import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  circularAvatar: {
    borderRadius: 1000,
    overflow: 'hidden'
  },
  checkmark: {
    borderRadius: 12,
    height: 24,
    width: 24,
    backgroundColor: COLORS.success300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: { minHeight: verticalScale(260), maxHeight: '75%' },
  container: { paddingHorizontal: scale(16) }
});
