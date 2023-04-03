import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: verticalScale(37.5),
    paddingBottom: '40%'
  },
  horizontalPadding: {
    paddingHorizontal: scale(25)
  },
  shareBtn: {
    backgroundColor: '#2f2b430d'
  },
  column: {
    flex: 1
  }
});
