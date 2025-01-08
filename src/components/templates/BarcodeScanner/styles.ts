import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: 'transparent',
    zIndex: 1000
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  getAccessBtn: {
    marginTop: verticalScale(4),
    backgroundColor: COLORS.brand600,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12)
  }
});
