import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderColor: COLORS.charcoal,
    borderBottomWidth: 1,
    borderTopWidth: 1
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
