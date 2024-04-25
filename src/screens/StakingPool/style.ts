import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { DEVICE_WIDTH } from '@constants/variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stakingInfoContainer: {
    paddingTop: verticalScale(DEVICE_WIDTH > 385 ? 18 : 36),
    paddingHorizontal: scale(16)
  }
});
