import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBarTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24)
  },
  tabsIndicator: {
    backgroundColor: COLORS.alphaBlack10,
    height: 0.5
  },
  tabContainer: {
    marginTop: scale(10),
    backgroundColor: COLORS.neutral200,
    borderWidth: scale(2),
    borderColor: COLORS.neutral200,
    position: 'relative',
    borderRadius: 24
  },
  contentContainerStyle: {
    flexGrow: 1
  }
});
