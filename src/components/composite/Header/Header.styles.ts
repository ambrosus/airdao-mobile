import { StyleSheet } from 'react-native';
import { shadow } from '../../../constants/shadow';

const leftPadding = '5%';
const rightPadding = '5%';
const topPadding = '2.5%';
const bottomPadding = '2.5%';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingLeft: leftPadding,
    paddingRight: rightPadding,
    paddingTop: topPadding,
    paddingBottom: bottomPadding,
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
    marginLeft: '5%' // TODO
  }
});
