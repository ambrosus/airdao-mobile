import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  sliderText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    justifyContent: 'flex-start',
    color: COLORS.silver
  },
  sliderTextContainer: {
    marginTop: -40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.silver,
    width: '100%'
  },
  infoContainer: {
    paddingRight: 12
  },
  slider: {
    alignItems: 'center'
  },
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  }
});
