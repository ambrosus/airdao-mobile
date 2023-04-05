import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(30),
    paddingLeft: scale(16),
    paddingRight: scale(18)
  }
});
