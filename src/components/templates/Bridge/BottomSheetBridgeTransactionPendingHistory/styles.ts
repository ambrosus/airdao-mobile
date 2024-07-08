import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: verticalScale(16),
    paddingHorizontal: scale(24)
  },
  heading: {
    textAlign: 'center'
  },
  description: {
    marginTop: verticalScale(-8),
    textAlign: 'center'
  },
  stageSection: {
    flexDirection: 'column',
    rowGap: verticalScale(8)
  },
  stageExtraRow: {
    marginTop: 4
  }
});
