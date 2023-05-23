import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  header: {
    paddingTop: scale(24),
    paddingHorizontal: scale(24)
  },
  container: {
    marginVertical: verticalScale(24),
    marginHorizontal: scale(18)
  },
  image: {
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
    width: 180,
    height: 160,
    alignItems: 'center'
  }
});
