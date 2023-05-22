import { scale, verticalScale } from '@utils/scaling';
import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  input: {
    width: '90%',
    alignSelf: 'center'
  },
  top: {
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  divider: {
    height: 1,
    backgroundColor: '#2f2b431a'
  },
  trackBtn: {
    backgroundColor: COLORS.deepBlue,
    paddingVertical: verticalScale(9),
    width: Dimensions.get('window').width - verticalScale(32),
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
