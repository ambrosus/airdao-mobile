import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  totalReducedAmountsContainer: {
    paddingHorizontal: scale(16),
    marginBottom: 16
  },
  listContentContainerStyle: {
    paddingHorizontal: scale(16)
  },
  listFooterComponent: {
    height: 120
  }
});
