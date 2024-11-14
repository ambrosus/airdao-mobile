import React, { useCallback, useMemo, useRef, useState } from 'react';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef, Header } from '@components/composite';
import { FiltersSelector } from '@features/kosmos/components/modular';
import {
  BottomSheetFilters,
  MarketsTabs
} from '@features/kosmos/components/templates';
import { FiltersState } from '@features/kosmos/types';
import { INITIAL_FILTERS } from '@features/kosmos/utils';

export const KosmosScreen = () => {
  const { t } = useTranslation();
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
          label={t('kosmos.filter')}
          onFiltersPress={onViewFiltersPress}
        />
      )
    );
  }, [onViewFiltersPress, selectedTabIndex, t]);

  return (
    <SafeAreaView>
      <Header
        title="Kosmos"
        bottomBorder
        style={styles.header}
        leftContainerStyles={styles.leftContainerStyles}
        rightContainerStyles={styles.rightContainerStyles}
        titlePosition="center"
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
