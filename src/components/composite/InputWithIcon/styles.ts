import { StyleSheet } from 'react-native';
import { shadow } from '@constants/shadow';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    ...shadow,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(17)
  }
});
