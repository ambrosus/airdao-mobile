import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  createNewListButton: {
    justifyContent: 'center'
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around'
  },
  tabsIndicatorWrapper: {
    backgroundColor: COLORS.alphaBlack10,
    height: 0.5
  },
  tabsIndicator: {
    position: 'relative',
    bottom: 1,
    left: 0,
    height: 2,
    backgroundColor: COLORS.brand500
  }
});
