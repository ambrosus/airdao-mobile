import { scale, verticalScale } from '@utils';
import { StyleSheet } from 'react-native';
import { DEVICE_WIDTH } from '@constants/variables';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    zIndex: 1000,
    backgroundColor: COLORS.neutral0
  },
  tabsContainer: {
    height: '100%'
  },
  stakingInfoContainer: {
    paddingTop: verticalScale(DEVICE_WIDTH > 385 ? 18 : 36),
    paddingHorizontal: scale(16)
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainerStyle: {
    flex: 1,
    flexGrow: 1
  }
});
