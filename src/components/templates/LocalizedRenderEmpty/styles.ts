import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  emptyContainer: {
    paddingTop: verticalScale(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(260)
  }
});
