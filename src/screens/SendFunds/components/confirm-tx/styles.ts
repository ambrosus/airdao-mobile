import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: scale(16)
  },
  innerContainer: {
    width: '100%',
    rowGap: verticalScale(24)
  },
  amountContainerRow: {
    columnGap: 4
  },
  pendingLayout: {
    columnGap: scale(8)
  }
});
