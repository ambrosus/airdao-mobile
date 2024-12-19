import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(18)
  },
  privateKey: {
    textAlign: 'center'
  },
  copyButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: 1000,
    backgroundColor: COLORS.brand100
  }
});
