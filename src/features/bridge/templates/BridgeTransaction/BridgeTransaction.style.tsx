import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  innerContainer: {
    flexDirection: 'column',
    gap: 4
  },
  leftContentRow: {
    gap: 10
  },
  statusPoint: { width: 10, height: 10, borderRadius: 10 },
  amount: {}
});
