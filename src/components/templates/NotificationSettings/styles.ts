import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(27),
    paddingLeft: scale(16),
    paddingRight: scale(20)
  },
  priceAlertContainer: { paddingHorizontal: 10 },
  priceAlertBtnContainer: {
    width: '30%',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: scale(7)
  },
  btnText: { fontSize: 17 }
});
