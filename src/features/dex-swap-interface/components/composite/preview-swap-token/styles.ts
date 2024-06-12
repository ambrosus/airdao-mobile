import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: scale(131),
    paddingVertical: 8,
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
