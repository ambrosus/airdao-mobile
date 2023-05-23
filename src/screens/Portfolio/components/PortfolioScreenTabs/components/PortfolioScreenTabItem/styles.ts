import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  tabTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center'
  },
  tabTitleText: {
    color: COLORS.nero,
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  }
});
