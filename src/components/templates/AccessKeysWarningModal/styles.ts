import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 25, 25, 0.4)'
  },
  container: {
    width: '85%',
    padding: scale(24),
    backgroundColor: COLORS.neutral0,
    borderRadius: 32
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  inner: {
    marginTop: scale(24),
    alignItems: 'center',
    rowGap: 8
  },
  innerTypography: {
    textAlign: 'center'
  },
  innerTypographyMargin: {
    marginTop: 8
  },
  buttonWithIcon: {
    width: '100%',
    marginTop: scale(24),
    backgroundColor: COLORS.brand500,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  }
});
