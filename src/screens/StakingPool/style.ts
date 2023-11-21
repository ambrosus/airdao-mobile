import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stakingInfoContainer: {
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(16)
  }
});
