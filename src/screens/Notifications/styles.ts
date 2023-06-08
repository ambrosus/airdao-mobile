import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flexGrow: 1,
    paddingTop: verticalScale(30),
    paddingBottom: '20%',
    paddingHorizontal: scale(15.5)
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
