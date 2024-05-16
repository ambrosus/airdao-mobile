import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  },
  heading: {
    paddingTop: verticalScale(8),
    rowGap: verticalScale(8),
    alignItems: 'center'
  },
  warning: {
    maxWidth: 318,
    textAlign: 'center'
  },
  container: {
    flex: 1
  },
  containerDivider: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listItem: {
    gap: scale(8),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: 48,
    backgroundColor: '#E6E6E6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mnemonicContainer: {
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    width: '100%',
    gap: 24
  }
});
