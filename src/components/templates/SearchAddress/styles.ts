import { Dimensions, StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingHorizontal: scale(16),
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
    backgroundColor: COLORS.brand500,
    paddingVertical: verticalScale(8),
    width: Dimensions.get('window').width - verticalScale(32),
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSheetHeader: {
    marginHorizontal: -20,
    marginBottom: -20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
});
