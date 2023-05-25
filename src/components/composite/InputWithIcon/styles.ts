import { Platform, StyleSheet } from 'react-native';
import { shadow } from '@constants/shadow';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    ...shadow,
    paddingHorizontal: scale(16),

    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(82),
    borderWidth: 1,
    borderColor: '#2f2b431a'
  },
  input: {
    borderRadius: 0,
    shadowColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical:
      Platform.OS === 'android' ? verticalScale(8) : verticalScale(13.5)
  }
});
