import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  bottomSheetInput: {
    borderRadius: 25,
    marginHorizontal: scale(16)
  },
  item: {
    paddingVertical: 18,
    borderColor: COLORS.separator,
    borderBottomWidth: 0.2
  },
  explorerItem: { flex: 1 },
  headerText: { marginLeft: scale(24) },
  inputWithIcon: { width: '65%', height: 50 },
  searchItem: { paddingHorizontal: scale(24), flex: 1 },
  listContainer: {
    paddingBottom: 150
  },
  buttonContainer: {
    position: 'absolute',
    bottom: verticalScale(32),
    alignSelf: 'center'
  }
});
