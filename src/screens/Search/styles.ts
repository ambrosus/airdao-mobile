import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  main: { flex: 1, paddingTop: verticalScale(12) },
  container: {
    flex: 1,
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  list: {
    flexGrow: 1,
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(126)
  },
  emptyList: { height: '100%' },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinnerFooter: {
    paddingVertical: scale(10),
    alignItems: 'center'
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30)
  },
  searchScreen: { flex: 1 },
  searchMain: {
    overflow: 'hidden'
  }
});
