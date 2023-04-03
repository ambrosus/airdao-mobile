import { moderateScale, scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: moderateScale(7),
    marginRight: scale(11),
    backgroundColor: '#D9D9D9',
    borderRadius: 36
  }
});
