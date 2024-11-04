import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginTop: scale(10)
  },
  contentWrapper: {
    height: '90%',
    justifyContent: 'space-between'
  },
  header: {
    marginTop: scale(15),
    paddingHorizontal: scale(15),
    paddingBottom: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
    marginBottom: scale(20)
  },
  menuItem: {
    borderWidth: 1,
    borderColor: COLORS.neutral100,
    marginBottom: scale(15),
    borderRadius: scale(15),
    marginHorizontal: scale(16),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(16)
  },
  bottomContent: {
    marginBottom: 50,
    justifyContent: 'center'
  },
  socialButtons: {
    flexDirection: 'row',
    paddingHorizontal: '20%',
    justifyContent: 'space-around',
    marginBottom: scale(10)
  }
});
