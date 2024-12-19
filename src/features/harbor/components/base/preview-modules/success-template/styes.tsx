import { StyleSheet } from 'react-native';
import { scale } from '@utils';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 16,
    padding: scale(10),
    paddingVertical: scale(12)
  }
});
