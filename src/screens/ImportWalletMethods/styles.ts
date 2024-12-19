import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: scale(16)
  },
  container: {
    flex: 1
  },
  contentContainerStyle: {
    gap: verticalScale(15)
  },
  addWalletMethodListItem: {
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    borderRadius: 15,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20)
  },
  addWalletMethodListItemGap: {
    gap: scale(8)
  }
});
