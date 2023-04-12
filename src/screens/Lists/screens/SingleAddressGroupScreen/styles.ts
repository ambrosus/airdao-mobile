import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  progressIcon: {
    paddingLeft: 7
  },
  container: {
    paddingTop: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {
    flexDirection: 'row'
  },
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {},
  idCount: {
    paddingRight: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  },
  tokensCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    paddingTop: 2
  },
  optionsButton: { alignItems: 'center', height: '100%', width: 35 },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  whalesTokenContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  infoContainer: {
    flexDirection: 'column'
  },
  contentContainer: {
    alignItems: 'flex-end'
  },
  priceProgressContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  buttonContainer: {},
  actionButton: {
    width: 25,
    alignItems: 'center'
  }
});
