import React, { useCallback, useMemo, useRef, useState } from 'react';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetRef, Header } from '@components/composite';
import { FiltersSelector } from '@features/kosmos/components/modular';
import {
  BottomSheetFilters,
  MarketsTabs
} from '@features/kosmos/components/templates';
import { FiltersState } from '@features/kosmos/types';
import { INITIAL_FILTERS } from '@features/kosmos/utils';

export const KosmosScreen = () => {
  const bottomSheetFiltersRef = useRef<BottomSheetRef>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);

  const onViewFiltersPress = useCallback(
    () => bottomSheetFiltersRef.current?.show(),
    []
  );

  const renderHeaderRightContent = useMemo(() => {
    return (
      selectedTabIndex === 0 && (
        <FiltersSelector
          label="Filter by"
          onFiltersPress={onViewFiltersPress}
        />
      )
    );
  }, [onViewFiltersPress, selectedTabIndex]);

  return (
    <SafeAreaView>
      <Header
        title="Kosmos"
        style={styles.header}
        leftContainerStyles={styles.leftContainerStyles}
        rightContainerStyles={styles.rightContainerStyles}
        titleStyle={styles.heading}
        titlePosition="left"
        backIconVisible
        contentRight={renderHeaderRightContent}
      />

      <MarketsTabs changeActiveIndex={setSelectedTabIndex} filters={filters} />
      <BottomSheetFilters
        ref={bottomSheetFiltersRef}
        updateFilters={setFilters}
      />
    </SafeAreaView>
  );
};
