import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end'
  },
  swiper: {
    alignSelf: 'center',
    width: scale(42),
    borderRadius: 42,
    marginTop: verticalScale(16)
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16
  }
});
