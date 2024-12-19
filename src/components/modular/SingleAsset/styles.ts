import { StyleSheet } from 'react-native';
import { moderateScale, scale } from '@utils';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    borderWidth: 0.5,
    borderColor: COLORS.semanticsForegroundBorder,
    borderRadius: moderateScale(16)
  },
  logo: {
    alignSelf: 'center'
  },
  item: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
