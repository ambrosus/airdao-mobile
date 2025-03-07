import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingHorizontal: scale(16),
    alignSelf: 'center'
  },
  top: {
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  divider: {
    height: 1,
    backgroundColor: '#2f2b431a'
  },
  trackBtn: {
    backgroundColor: COLORS.brand500,
    paddingVertical: verticalScale(8),
    width: Dimensions.get('window').width - verticalScale(32),
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSheetHeader: {
    marginHorizontal: -20,
    marginBottom: -20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  error: {
    flex: 1,
    paddingTop: '50%',
    alignItems: 'center',
    paddingHorizontal: '15%'
  },
  circle: {
    width: moderateScale(130),
    height: moderateScale(130),
    borderRadius: moderateScale(65),
    backgroundColor: COLORS.lightSilver
  },
  search: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconRow: { right: 0 },
  button: { zIndex: 1000 },
  inputWrapper: { width: '80%' },
  searchAddress: { width: '60%' },
  searchAddressButtonTitle: {
    color: COLORS.brand500,
    fontSize: 14
  },
  centerSpinner: { marginTop: 15 },
  keyboardDismiss: { flex: 1, paddingHorizontal: scale(16) },
  searchedKeyboardDismiss: { flex: 1 }
});
