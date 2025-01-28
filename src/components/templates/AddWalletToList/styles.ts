import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: COLORS.neutral0,
    paddingBottom: verticalScale(12)
  },
  list: {
    paddingHorizontal: scale(20)
  },
  item: {
    marginTop: verticalScale(20),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator
  }
});
