import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  searchBar: {
    backgroundColor: COLORS.white,
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
