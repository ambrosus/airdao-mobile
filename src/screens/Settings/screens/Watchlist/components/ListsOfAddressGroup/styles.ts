import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils';

export const styles = StyleSheet.create({
  groupsContainer: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 17
  },
  contentContainer: {
    paddingBottom: 150
  },
  emptyList: { paddingTop: verticalScale(200) }
});
