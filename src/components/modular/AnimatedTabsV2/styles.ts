import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBarTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingVertical: verticalScale(10)
  },
  tabHeader: {
    fontFamily: 'Inter_700Bold',
    color: COLORS.midnight,
    fontSize: 16,
    marginLeft: scale(8)
  },
  tabContainer: {
    marginTop: scale(10),
    backgroundColor: COLORS.neutral100,
    borderWidth: scale(2),
    borderColor: COLORS.neutral100,
    position: 'relative',
    borderRadius: 24
  },
  mainView: {
    borderRadius: 24,
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute'
  },
  contentContainerStyle: {
    flexGrow: 1
  }
});
