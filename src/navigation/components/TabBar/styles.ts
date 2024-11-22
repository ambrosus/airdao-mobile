import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { isIos } from '@utils/isPlatform';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    bottom: 0,
    backgroundColor: COLORS.neutral0,
    opacity: 2,
    elevation: 0.25,
    borderTopWidth: isIos ? 0.25 : 0.5,
    borderTopColor: COLORS.neutral200
  },
  mainItemContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    backgroundColor: COLORS.neutral0
  }
});
