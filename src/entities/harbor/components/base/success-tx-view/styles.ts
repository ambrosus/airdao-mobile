import { StyleSheet } from 'react-native';
import { verticalScale, scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  header: {
    marginTop: 12,
    rowGap: 8,
    alignItems: 'center'
  },
  details: {
    width: '100%',
    marginTop: verticalScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    borderRadius: 16,
    backgroundColor: 'rgba(88, 94, 119, 0.08)',
    rowGap: verticalScale(16)
  },
  txHashContainer: {
    paddingHorizontal: scale(12),
    borderRadius: 24,
    backgroundColor: 'rgba(88, 94, 119, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  }
});
