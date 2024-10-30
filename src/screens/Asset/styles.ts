import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  headerContentRightContainer: {
    shadowColor: 'transparent'
  },
  container: {
    flex: 1
  },
  innerContainer: {
    alignItems: 'flex-start',
    marginTop: verticalScale(24)
  },
  accountDetails: {
    rowGap: verticalScale(8),
    paddingHorizontal: scale(16)
  },
  accountDetailsFooter: {
    columnGap: scale(8)
  },
  actionsContainer: {
    width: '100%',
    marginTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8DAE0',
    paddingHorizontal: scale(16)
  },
  transactions: {
    width: '100%',
    paddingTop: verticalScale(24)
  },
  transactionsContainer: {
    paddingBottom: '40%'
  },
  transactionsList: {
    height: '75%'
  }
});
