import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemLabelContainer: {
    columnGap: 8
  },
  logo: {
    width: scale(24),
    height: scale(24)
  }
});
