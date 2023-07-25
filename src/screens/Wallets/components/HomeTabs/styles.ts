import { StyleSheet } from 'react-native';
import { moderateScale, scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  homeTabs: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: scale(24),
    borderRadius: 24
  },
  tabView: {
    flex: 1,
    paddingTop: scale(24)
  },
  addButton: {
    right: scale(24),
    position: 'absolute',
    backgroundColor: COLORS.electricBlue,
    borderRadius: 50,
    width: moderateScale(32),
    height: moderateScale(32)
  },
  homeWatchlistsContainer: {
    flex: 1,
    paddingHorizontal: scale(24)
  },
  seeAllButton: {
    marginHorizontal: scale(24),
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.powderWhite,
    borderRadius: 24
  },
  homeCollectionsContainer: {
    flex: 1,
    paddingHorizontal: scale(24)
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
