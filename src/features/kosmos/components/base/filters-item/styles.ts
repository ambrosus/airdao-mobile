import { StyleSheet } from 'react-native';
import { scale, moderateScale } from '@utils';

export const styles = StyleSheet.create({
  itemContainer: {
    width: scale(98),
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(8)
  }
});
