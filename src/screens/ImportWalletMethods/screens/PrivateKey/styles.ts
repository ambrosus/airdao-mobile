import { StyleSheet } from 'react-native';
import { moderateScale, scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleStyle: {
    fontSize: 18
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16)
  },
  input: {
    width: '100%',
    height: 90,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(12)
  },
  toggleVisibilityRow: {
    gap: 8
  }
});
