import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  completed: {
    backgroundColor: '#d9f9e6',
    alignItems: 'center',
    flexDirection: 'row'
  },
  completedCircle: {
    height: 8,
    width: 8,
    borderRadius: 25,
    backgroundColor: COLORS.success400,
    marginLeft: 8
  }
});
