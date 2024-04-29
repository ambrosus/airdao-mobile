import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  statusMain: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: scale(20)
  },
  statusText: {
    color: COLORS.success700
  }
});

export const successStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.success100,
    borderColor: COLORS.success200,
    borderWidth: 1
  },
  text: {
    color: COLORS.success700
  }
});
export const pendingStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.warning100,
    borderColor: COLORS.warning200,
    borderWidth: 1
  },
  text: {
    color: COLORS.warning700
  }
});
export const errorStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.error100,
    borderColor: COLORS.error200,
    borderWidth: 1
  },
  text: {
    color: COLORS.error700
  }
});
