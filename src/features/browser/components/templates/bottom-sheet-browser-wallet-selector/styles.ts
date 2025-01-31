import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  main: { paddingBottom: verticalScale(24) },
  listWrapper: { marginVertical: scale(16) },
  contentContainerStyle: {
    paddingHorizontal: scale(12)
  }
});
