import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    paddingTop: verticalScale(15),
    flex: 1,
    justifyContent: 'space-between'
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.neutral100
  },
  infoContainer: { paddingHorizontal: scale(16) },
  buttonWrapper: { paddingHorizontal: scale(16) },
  button: {
    marginBottom: verticalScale(24)
  },
  buttonText: { marginVertical: scale(12) }
});
