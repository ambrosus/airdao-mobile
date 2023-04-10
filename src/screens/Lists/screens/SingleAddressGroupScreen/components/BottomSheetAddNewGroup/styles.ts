import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  bottomSheetInput: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 13.5,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.silver
  },
  progressIcon: {
    paddingLeft: 7
  },
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  flatListContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  whalesTokenContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  infoContainer: {
    flexDirection: 'column',
    paddingLeft: 10
  },
  priceProgressContainer: {
    alignItems: 'flex-end'
  }
});
