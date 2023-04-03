import { StyleSheet } from 'react-native';
import { shadow } from '@constants/shadow';
import { scale, verticalScale } from '@utils/scaling';

const leftPadding = '5%';
const rightPadding = '5%';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: verticalScale(48),
    paddingLeft: leftPadding,
    paddingRight: rightPadding,
    ...shadow
  },
  left: {
    position: 'absolute',
    left: leftPadding
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  right: {
    position: 'absolute',
    right: rightPadding
  },
  titleOnLeft: {
    marginLeft: scale(20)
  }
});
