import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainerStyle: {
    paddingHorizontal: 18,
    gap: verticalScale(16)
  },
  addWalletMethodListItem: {
    paddingVertical: verticalScale(8)
  },
  addWalletMethodListItemGap: {
    gap: scale(8)
  }
});
