import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  popoverStyle: {
    borderRadius: scale(4),
    padding: scale(8)
  },
  container: {
    backgroundColor: '#DCDBDC',
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8)
  },
  popover: {},
  content: {},
  title: {},
  subtitle: {}
});
