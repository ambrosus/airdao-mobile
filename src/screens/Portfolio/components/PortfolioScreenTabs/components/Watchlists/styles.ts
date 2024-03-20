import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: scale(16),
    flex: 1,
    marginTop: 1
  },
  addressesWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addressesList: { paddingBottom: '40%' }
});
