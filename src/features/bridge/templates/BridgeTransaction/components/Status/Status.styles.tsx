import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { FONT } from '@constants/fonts';

export const styles = StyleSheet.create({
  statusMain: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: scale(20)
  },
  statusText: {
    color: COLORS.success700
  }
});

export const successStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.success100,
    borderColor: COLORS.success200,
    borderWidth: 1
  },
  text: {
    color: COLORS.success700
  }
});

export const claimPendingStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.neutral100,
    borderColor: COLORS.neutral200,
    borderWidth: 1
  },
  text: {
    color: COLORS.neutral800
  }
});

export const pendingStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.warning100,
    borderColor: COLORS.warning200,
    borderWidth: 1
  },
  text: {
    color: COLORS.warning700
  }
});
export const defaultStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.neutral0,
    borderColor: COLORS.neutral100,
    borderWidth: 1
  },
  text: {
    color: COLORS.neutral900,
    fontSize: 14,
    fontFamily: FONT.Inter500Medium
  }
});
export const confirmationStyles = {
  background: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.warning100,
    borderColor: COLORS.warning200,
    borderWidth: 1
  },
  text: {
    color: COLORS.warning700
  }
};
export const errorStyle = StyleSheet.create({
  background: {
    backgroundColor: COLORS.error100,
    borderColor: COLORS.error200,
    borderWidth: 1
  },
  text: {
    color: COLORS.error700
  }
});
