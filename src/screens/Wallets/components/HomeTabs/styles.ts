import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  homeTabs: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24
  },
  tabView: {
    flex: 1,
    paddingTop: scale(24)
  },
  addButton: {
    marginTop: scale(10),
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.electricBlue,
    borderRadius: 50,
    width: 32,
    height: 32
  },
  homeWatchlistsContainer: {
    paddingHorizontal: 24,
    flex: 1
  },
  seeAllButton: {
    alignItems: 'center',
    backgroundColor: '#edf3ff',
    borderRadius: 24,
    alignSelf: 'center',
    width: '100%',
    marginBottom: scale(24)
  },
  homeCollectionsContainer: {
    paddingHorizontal: 24,
    flex: 1
  }
});
