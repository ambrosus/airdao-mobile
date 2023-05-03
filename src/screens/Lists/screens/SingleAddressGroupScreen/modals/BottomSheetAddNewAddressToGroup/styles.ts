import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  bottomSheetInput: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 13.5,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.silver
  },
  progressIcon: {
    paddingLeft: 7
  },
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  headerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: COLORS.smokyBlack
  },
  itemContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  addressTitleContainer: {
    alignItems: 'flex-start',
    paddingLeft: 16
  },
  locationInfo: {
    paddingLeft: 5
  },
  whalesTokenContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  infoContainer: {
    flexDirection: 'column',
    paddingLeft: 10,
    alignItems: 'flex-end'
  },
  priceProgressContainer: {
    alignItems: 'flex-end'
  },
  checkboxPadding: {
    paddingRight: 16
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
    backgroundColor: COLORS.deepBlue,
    borderRadius: 25,
    width: '90%'
  },
  bottomAddToListButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: 16,
    color: COLORS.white
  },
  bottomTrackNewAddressButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: 16,
    color: COLORS.deepBlue
  },
  bottomTrackNewAddressButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    width: '90%',
    backgroundColor: '#c9d9ff'
  }
});
