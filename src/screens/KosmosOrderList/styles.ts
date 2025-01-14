import { StyleSheet } from 'react-native';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  header: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: scale(15)
  },
  leftContainerStyles: {
    left: scale(16.5)
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
