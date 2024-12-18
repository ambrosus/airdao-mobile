import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: scale(12)
  },
  stakeInfoText: {
    paddingHorizontal: scale(2),
    paddingTop: scale(8),
    paddingBottom: scale(16)
  },
  buttonWrapper: { paddingBottom: scale(20) },
  container: { justifyContent: 'space-between' }
});
