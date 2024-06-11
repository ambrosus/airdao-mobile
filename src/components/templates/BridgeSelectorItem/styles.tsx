import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  mainButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    paddingVertical: scale(20)
  },
  text: { fontSize: scale(16) }
});
