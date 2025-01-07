import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {},
  contentWrapper: {
    justifyContent: 'space-between',
    paddingBottom: '22%',
    height: '90%'
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
    justifyContent: 'center'
  },
  socialButtons: {
    flexDirection: 'row',
    paddingHorizontal: '20%',
    justifyContent: 'space-around',
    marginBottom: scale(10)
  }
});
