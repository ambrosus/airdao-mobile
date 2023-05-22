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
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: COLORS.smokyBlack
  },
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  idCount: {
    paddingRight: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 12
  },
  tokensCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.midnight,
    paddingTop: 2
  },
  optionsButton: {
    alignItems: 'center',
    backgroundColor: COLORS.charcoal,
    borderRadius: 50,
    width: 32,
    height: 32
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: COLORS.electricBlue,
    borderRadius: 50,
    width: 32,
    height: 32
  },
  header: {
    flex: 1,
    marginLeft: 17,
    marginRight: 17
  },
  addressItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 32
  },
  touchableAreaContainer: {},
  buttonContainer: {
    paddingRight: 5
  },
  actionButton: {
    width: 25,
    alignItems: 'center'
  },
  floatButtonTitle: {
    fontFamily: 'Inter_600SemiBold'
  }
});
