import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(16.5)
  },
  list: {
    height: '100%'
  },
  tableHeaderTextStyle: {
    marginBottom: 16
  }
});
