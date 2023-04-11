import { shadow } from '@constants/shadow';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(12)
  },
  input: {
    ...shadow,
    width: '100%',
    backgroundColor: '#FFFFFF'
  },
  newListButton: {
    width: '100%',
    backgroundColor: '#0e0e0e0d',
    paddingVertical: verticalScale(12)
  }
});
