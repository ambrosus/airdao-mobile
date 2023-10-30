import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16)
  },
  navigationButton: {
    justifyContent: 'center',
    height: 45,
    width: 109
  },
  createNewListButton: {
    justifyContent: 'center'
  },
  androidButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.brand500,
    borderRadius: 50,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 50,
    right: scale(15),
    zIndex: 10
  }
});
