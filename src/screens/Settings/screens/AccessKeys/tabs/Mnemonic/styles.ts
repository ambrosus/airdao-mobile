import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heading: {
    textAlign: 'center'
  },
  mnemonicWordListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    width: '50%',
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
    backgroundColor: COLORS.neutral100
  },
  contentContainerStyle: {
    gap: 8,
    paddingHorizontal: scale(16)
  }
});
