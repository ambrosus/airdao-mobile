import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { alignSelf: 'center' },
  contentContainerStyle: {
    paddingBottom: '25%',
    paddingHorizontal: scale(16),
    rowGap: verticalScale(8)
  }
});
