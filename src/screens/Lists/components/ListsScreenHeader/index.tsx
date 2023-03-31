import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { Button, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheetFilters } from '@screens/Lists/components/BottomSheetFilters';
import { BottomSheetListSettings } from '@screens/Lists/components/BottomSheetListSettings';
import { FilterIcon } from '@components/svg/icons/Filter';
import { SettingsIcon } from '@components/svg/icons/Settings';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';

export const ListsScreenHeader = () => {
  const filterRef = useRef<BottomSheetRef>(null);
  const handleOpenFilter = useCallback(() => {
    filterRef.current?.show();
  }, []);
  const settingsRef = useRef<BottomSheetRef>(null);
  const handleOpenSettings = useCallback(() => {
    settingsRef.current?.show();
  }, []);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.badgeButtonsContainer}>
        <Button
          onPress={handleOpenFilter}
          style={{ ...styles.badgeButtonContainer, ...styles.settingsButton }}
          type="base"
        >
          <View style={styles.badgeButtonIcon}>
            <FilterIcon />
          </View>
        </Button>
        <Button
          onPress={handleOpenSettings}
          style={styles.badgeButtonContainer}
          type="base"
        >
          <View style={styles.badgeButtonIcon}>
            <SettingsIcon />
          </View>
        </Button>
      </View>
      <Spacer value={9} />
      <Text style={styles.balanceSubtitle}>Total list balance</Text>
      <Spacer value={15} />
      <Text style={styles.balanceCount}>$3,900.90</Text>
      <View style={styles.balanceStats}>
        <Text
          style={[
            styles.balanceTokens,
            { fontFamily: 'Inter_500Medium', fontSize: 12 }
          ]}
        >
          20,000 AMB
        </Text>
        <ProgressArrowIcon />
        <Text
          style={[
            styles.progressInfo,
            {
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
              color: COLORS.lightGrey
            }
          ]}
        >
          4%
        </Text>
        <Text>24HR</Text>
      </View>
      <BottomSheetFilters ref={filterRef} />
      <BottomSheetListSettings ref={settingsRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { paddingTop: 5, paddingLeft: 16 },
  badgeButtonsContainer: {
    flexDirection: 'row',
    paddingRight: 17,
    justifyContent: 'flex-end'
  },
  settingsButton: {
    marginRight: 16
  },
  balanceSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: 1
  },
  balanceCount: {
    paddingBottom: 12,
    fontFamily: 'Mersad_600SemiBold',
    fontSize: 36,
    color: COLORS.black
  },
  balanceStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceTokens: {
    paddingRight: 14
  },
  progressInfo: {
    paddingLeft: 7,
    paddingRight: 4
  },
  badgeButtonContainer: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ' rgba(47, 43, 67, 0.05)'
  },
  badgeButtonIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
