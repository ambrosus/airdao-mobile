import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    paddingVertical: verticalScale(24),
    flex: 1
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(32)
  },
  horizontalPadding: {
    paddingHorizontal: scale(16)
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral100,
    marginVertical: verticalScale(16)
  },
  loading: {
    alignSelf: 'center'
  },
  keyboardAvoidingContainer: {
    flex: 1
  },
  addressError: {
    marginTop: verticalScale(2),
    marginLeft: scale(4)
  }
});
