import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(32),
    paddingHorizontal: scale(19),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17
  },
  walletsCount: {
    paddingRight: scale(14),
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  },
  tokensCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    paddingTop: 2
  },
  optionButton: {
    alignItems: 'center',
    width: moderateScale(40)
  }
});
