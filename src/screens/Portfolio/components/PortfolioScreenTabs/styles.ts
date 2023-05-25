import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16
  },
  navigationButton: {
    justifyContent: 'center',
    height: 45,
    width: 109
  },
  createNewListButton: {
    justifyContent: 'center',
    height: 45,
    width: 138
  },
  androidButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.electricBlue,
    borderRadius: 50,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: '18%',
    right: '4%',
    zIndex: 10
  }
});
