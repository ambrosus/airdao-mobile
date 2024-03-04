import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
export const styles = StyleSheet.create({
  buttonWrapper: {
    padding: scale(14),
    flexDirection: 'row',
    borderRadius: scale(16),
    alignItems: 'center'
  },
  buttonContainer: { paddingHorizontal: scale(16) }
});
