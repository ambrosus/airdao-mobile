import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {
    flexDirection: 'row'
  },
  itemTitle: {},
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
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
  optionsButton: {
    alignItems: 'center',
    height: '100%',
    width: 35
  },
  header: {
    flex: 1,
    marginLeft: 17,
    marginRight: 10
  },
  addressItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 32
  },
  touchableAreaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  buttonContainer: {
    paddingRight: 5
  },
  actionButton: {
    width: 25,
    alignItems: 'center'
  },
  progressIcon: {
    paddingLeft: 7
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
  }
});
