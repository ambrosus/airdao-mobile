import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral0,
    paddingTop: 14,
    paddingBottom: 18,
    borderColor: COLORS.alphaBlack5,
    borderBottomWidth: 1
  },
  item: {
    justifyContent: 'space-between'
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
  },
  rightActions: {
    backgroundColor: COLORS.alphaBlack5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: scale(130)
  },
  rightActionsButton: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
