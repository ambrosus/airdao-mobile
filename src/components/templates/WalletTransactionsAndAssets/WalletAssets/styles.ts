import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { alignSelf: 'center' },
  contentContainerStyle: {
    paddingBottom: '25%',
    paddingHorizontal: scale(16),
    rowGap: verticalScale(8)
  }
});
