import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  headerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: COLORS.smokyBlack
  },
  saveBtnAndroid: {
    backgroundColor: COLORS.deepBlue,
    borderRadius: 1000,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
