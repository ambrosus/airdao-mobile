import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
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
