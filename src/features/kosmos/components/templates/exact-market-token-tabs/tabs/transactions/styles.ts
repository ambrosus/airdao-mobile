import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(16),
    marginHorizontal: scale(16.5)
  },
  list: {
    flex: 1,
    maxHeight: 450
  },
  tableHeaderTextStyle: {
    marginBottom: 16
  }
});
