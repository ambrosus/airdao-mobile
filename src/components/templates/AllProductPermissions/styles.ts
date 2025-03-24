import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';
export const styles = StyleSheet.create({
  noPermissionsContainer: {
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(15)
  },
  noPermissionsImage: {
    width: scale(188),
    height: verticalScale(87),
    objectFit: 'contain'
  },
  listContainer: {
    paddingHorizontal: scale(10),
    paddingTop: scale(10)
  }
});
