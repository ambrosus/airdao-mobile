import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  main: {
    height: '90%',
    justifyContent: 'space-between'
  },
  container: {
    width: '100%',
    marginTop: scale(10)
  },
  header: {
    paddingHorizontal: scale(15),
    width: '100%',
    paddingBottom: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
    marginBottom: scale(20)
  },
  menuItem: {
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    marginBottom: scale(15),
    borderRadius: scale(15),
    marginHorizontal: scale(16),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(16)
  },
  bottomContent: {
    justifyContent: 'center',
    marginBottom: scale(30)
  },
  socialButtons: {
    flexDirection: 'row',
    paddingHorizontal: '20%',
    justifyContent: 'space-around',
    marginBottom: scale(10)
  }
});
