import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  totalReducedAmountsContainer: {
    paddingHorizontal: scale(16),
    marginBottom: 16
  },
  listContentContainerStyle: {
    flex: 1,
    paddingHorizontal: scale(16)
  },
  listFooterComponent: {
    height: 120
  }
});
