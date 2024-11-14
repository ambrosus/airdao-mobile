import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: verticalScale(16)
  },
  heading: {
    textAlign: 'center'
  },
  description: {
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
