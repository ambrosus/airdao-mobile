import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    marginBottom: verticalScale(16),
    columnGap: scale(16)
  },
  container: {
    flex: 1,
    width: '100%'
  },
  columnWrapperStyle: {
    gap: scale(17),
    justifyContent: 'space-between'
  },
  contentContainerStyle: {
    gap: scale(17)
  }
});
