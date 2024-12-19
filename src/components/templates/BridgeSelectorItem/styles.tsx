import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  mainButton: {
    marginBottom: scale(10),

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    paddingVertical: scale(15),
    alignItems: 'center'
  },
  mainSelectedButton: {
    borderWidth: 1,
    borderRadius: scale(15),
    backgroundColor: COLORS.neutral100,
    borderColor: COLORS.neutral200
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  textTop: {
    color: COLORS.black,
    fontSize: scale(16)
  },
  textBottom: {
    fontSize: scale(15)
  },
  boldText: {
    fontSize: scale(16),
    fontWeight: '600'
  }
});
