import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent'
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(18),
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
