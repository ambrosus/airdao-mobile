import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  homeTabs: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24
  },
  tabView: {
    flex: 1,
    paddingTop: scale(24)
  }
});
