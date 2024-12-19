import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  valueText: {
    marginLeft: scale(8),
    color: COLORS.neutral900
  },
  rewardWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '30%'
  },
  tierWrapper: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '70%'
  }
});
