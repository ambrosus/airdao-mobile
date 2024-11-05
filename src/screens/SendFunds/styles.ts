import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  header: {
    shadowColor: COLORS.neutral0
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
  input: {
    textAlign: 'center',
    fontFamily: 'Mersad_600SemiBold',
    shadowColor: 'transparent',
    lineHeight: 50,
    fontSize: 46,
    borderWidth: 0
  },
  addressError: {
    marginTop: verticalScale(2),
    marginLeft: scale(4)
  },
  inputButton: {
    width: '100%',
    height: 60,
    position: 'absolute',
    top: 15,
    zIndex: 100
  }
});
