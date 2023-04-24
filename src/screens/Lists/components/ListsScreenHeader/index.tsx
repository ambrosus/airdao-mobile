import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { Button, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheetListsFilters } from '@screens/Lists/components/BottomSheetListsFilters';
import { BottomSheetListsSettings } from '@screens/Lists/components/BottomSheetListsSettings';
import { FilterIcon } from '@components/svg/icons/Filter';
import { SettingsIcon } from '@components/svg/icons/Settings';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { styles } from '@screens/Lists/components/ListsScreenHeader/styles';
import { NumberUtils } from '@utils/number';

type Props = {
  totalAmount: number;
};
export const ListsScreenHeader = ({ totalAmount }: Props) => {
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
      <Text style={styles.balanceCount}>
        ${NumberUtils.formatNumber(totalAmount, 0)}
      </Text>
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
      <BottomSheetListsFilters ref={filterRef} />
      <BottomSheetListsSettings ref={settingsRef} />
    </View>
  );
};
