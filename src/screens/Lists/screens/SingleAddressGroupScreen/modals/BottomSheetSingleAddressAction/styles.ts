import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  container: {
    paddingTop: 32,
    paddingHorizontal: 19,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {},
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17
  },
  walletsCount: {
    paddingRight: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  }
});
