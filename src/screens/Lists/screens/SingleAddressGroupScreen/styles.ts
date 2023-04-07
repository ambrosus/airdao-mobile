import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  progressIcon: {
    paddingLeft: 7
  },
  container: {
    paddingTop: 15,
    paddingHorizontal: 5,
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
  flatListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  whalesTokenContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  infoContainer: {
    flexDirection: 'column'
  },
  priceProgressContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonContainer: {
    paddingHorizontal: 10
  }
});
