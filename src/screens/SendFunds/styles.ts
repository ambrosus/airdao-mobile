import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

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
  keyboardAvoidingContainer: {
    flex: 1
  },
  addressError: {
    marginTop: verticalScale(2),
    marginLeft: scale(4)
  }
});
