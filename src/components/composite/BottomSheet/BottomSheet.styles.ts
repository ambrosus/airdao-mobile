import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginHorizontal: 10,
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
