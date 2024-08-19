import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listFooterComponent: {
    height: 120
  },
  loader: {
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableHeaderTextStyle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral600,
    textTransform: 'uppercase',
    marginBottom: 16
  }
});
