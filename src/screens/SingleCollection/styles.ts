import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: { flex: 1 },
  optionsButton: {
    alignItems: 'center',
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: 50,
    width: 32,
    height: 32
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 32,
    height: 32
  },
  headerContainer: {
    maxWidth: '70%',
    alignItems: 'flex-start',
    paddingLeft: scale(28)
  },
  headerStyle: {
    shadowColor: COLORS.transparent
  },
  balanceWrapper: { alignItems: 'center' },
  infoContainer: { flexDirection: 'row' },
  addressList: { flex: 1, paddingHorizontal: scale(16) },
  addressListContainer: { paddingBottom: '10%' }
});
