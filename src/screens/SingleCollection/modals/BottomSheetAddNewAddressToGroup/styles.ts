import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  bottomSheetInput: {
    borderRadius: 25,
    marginHorizontal: scale(16)
  },
  checkboxPadding: {
    paddingRight: 16
  },
  itemContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    bottom: 20
  },
  bottomAddToListButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.brand500,
    borderRadius: 25,
    width: '90%'
  },
  bottomAddToListButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: 16,
    color: COLORS.neutral0
  },
  bottomTrackNewAddressButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: 16,
    color: COLORS.brand500
  },
  bottomTrackNewAddressButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    width: '90%',
    backgroundColor: '#c9d9ff'
  },
  item: {
    paddingVertical: 18,
    borderColor: COLORS.separator,
    borderBottomWidth: 0.2
  }
});
