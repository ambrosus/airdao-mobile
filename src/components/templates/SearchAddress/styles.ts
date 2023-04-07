import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    width: '70%'
  },
  top: {
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  divider: {
    height: 1,
    backgroundColor: '#2f2b431a'
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
