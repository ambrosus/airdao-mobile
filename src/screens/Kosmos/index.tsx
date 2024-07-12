import React, { useMemo, useState } from 'react';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { FiltersSelector } from '@features/kosmos/components/modular';
import { MarketsTabs } from '@features/kosmos/components/templates';
import { FiltersState } from '@features/kosmos/types';

export const KosmosScreen = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [filters] = useState<FiltersState>({
    status: 'all',
    payment: null
  });

  const renderHeaderRightContent = useMemo(() => {
    return selectedTabIndex === 0 && <FiltersSelector label="Filter by" />;
  }, [selectedTabIndex]);

  return (
    <SafeAreaView>
      <Header
        title="Kosmos"
        style={styles.header}
        leftContainerStyles={styles.leftContainerStyles}
        rightContainerStyles={styles.rightContainerStyles}
        titleStyle={styles.heading}
        titlePosition="left"
        backIconVisible={false}
        contentRight={renderHeaderRightContent}
      />

      <MarketsTabs changeActiveIndex={setSelectedTabIndex} filters={filters} />
    </SafeAreaView>
  );
};
