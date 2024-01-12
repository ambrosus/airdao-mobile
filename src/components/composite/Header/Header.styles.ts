import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

const leftPadding = '5%';
const rightPadding = '5%';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.neutral0,
    height: verticalScale(48),
    minHeight: 56,
    paddingLeft: leftPadding,
    paddingRight: rightPadding
  },
  left: {
    position: 'absolute',
    zIndex: 1000,
    left: leftPadding
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  right: {
    zIndex: 1000,
    position: 'absolute',
    right: rightPadding
  },
  titleOnLeft: {
    marginLeft: scale(20)
  }
});
