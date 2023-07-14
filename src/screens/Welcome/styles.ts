import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 52,
    height: 52,
    backgroundColor: '#EDF3FF'
  },
  optionsContainer: {
    paddingRight: 60,
    paddingLeft: scale(24)
  },
  getStartedButton: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.deepBlue,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 30
  }
});
