import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  tooltip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: COLORS.gray500,
    borderRadius: 24,
    zIndex: 1000
  },
  tooltipButton: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLORS.brand500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 109,
    borderRadius: 24
  },
  tooltipButtonText: {
    justifyContent: 'center',
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: 16,
    paddingLeft: 7,
    color: COLORS.neutral0
  }
});
