import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(12),
    paddingLeft: scale(17),
    paddingRight: scale(19)
  },
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  separator: {
    backgroundColor: '#2f2b431a',
    height: 1,
    width: '100%'
  }
});
