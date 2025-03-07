import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listHeader: {
    paddingHorizontal: scale(20)
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16)
  }
});
