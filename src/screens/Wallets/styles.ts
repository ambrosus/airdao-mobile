import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: '25%'
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(48)
  },
  divider: {
    height: 2,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#2f2b431a',
    marginVertical: verticalScale(24)
  },
  airdao: {
    marginTop: verticalScale(32)
  }
});
