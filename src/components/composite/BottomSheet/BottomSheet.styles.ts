import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    marginHorizontal: 0,
    justifyContent: 'flex-end'
  },
  swiper: {
    alignSelf: 'center',
    backgroundColor: 'red',
    width: scale(42),
    borderRadius: 42,
    marginTop: verticalScale(16)
  }
});
