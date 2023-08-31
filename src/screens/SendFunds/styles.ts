import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(24),
    flex: 1
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
  input: {
    shadowColor: 'transparent',
    alignSelf: 'center',
    fontSize: 46
  },
  addressError: {
    marginTop: verticalScale(2),
    marginLeft: scale(4)
  }
});
