import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(12)
  },
  logo: {
    alignSelf: 'center'
  }
});
