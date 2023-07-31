import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
export const styles = StyleSheet.create({
  container: {
    paddingBottom: verticalScale(24)
  },
  newListTitle: {
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  portfolioPerfomance: {
    marginHorizontal: scale(24),
    marginTop: verticalScale(17)
  },
  shareButtons: {
    // paddingHorizontal: scale(30),
    alignItems: 'center'
  },
  shareBtn: {
    backgroundColor: '#0e0e0e0d',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16)
  },
  twitterBtn: {
    backgroundColor: '#1d9bf0',
    width: scale(48),
    height: scale(48)
  },
  messagesBtn: {
    backgroundColor: '#3AD758',
    width: scale(48),
    height: scale(48)
  },
  lightBtn: {
    backgroundColor: 'rgba(47, 43, 67, 0.05)',
    width: '90%',
    height: scale(48)
  },
  shareButton: {
    alignItems: 'center'
  }
});
