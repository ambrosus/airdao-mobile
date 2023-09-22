import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(116),
    paddingHorizontal: scale(18)
  },
  content: {
    paddingHorizontal: scale(46),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(60)
  },
  button: {
    paddingVertical: verticalScale(12),
    width: '100%',
    backgroundColor: COLORS.brand500
  },
  editButton: {
    paddingVertical: verticalScale(12),
    width: '100%',
    backgroundColor: COLORS.brand500,
    borderWidth: 1,
    borderColor: COLORS.neutral0
  },
  closeButton: {
    position: 'absolute',
    top: verticalScale(22),
    left: scale(24)
  }
});
