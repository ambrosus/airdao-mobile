import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(12),
    paddingLeft: scale(17),
    paddingRight: scale(19)
  },
  header: {
    shadowColor: 'transparent',
    zIndex: 1000,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: COLORS.smokyBlack
  },
  separator: {
    backgroundColor: '#2f2b431a',
    height: 1,
    width: '100%'
  },
  input: {
    ...shadow,
    flex: 1,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(82),
    backgroundColor: '#FFFFFF'
  },
  bottomSheet: {
    marginHorizontal: -20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: -20
  }
});
