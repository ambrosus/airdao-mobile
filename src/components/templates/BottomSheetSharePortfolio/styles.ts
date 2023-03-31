import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: verticalScale(54)
  },
  newListTitle: {
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  portfolioPerfomance: {
    marginHorizontal: scale(9),
    marginTop: verticalScale(30)
  },
  shareButtons: {
    paddingHorizontal: scale(30)
  },
  darkBtn: {
    backgroundColor: '#646464',
    width: scale(48),
    height: scale(48)
  },
  lightBtn: {
    backgroundColor: 'rgba(47, 43, 67, 0.05)',
    width: scale(48),
    height: scale(48)
  },
  shareButton: {
    alignItems: 'center'
  }
});
