import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { StakeInfoContainer, TiersInfoContainer } from './components';
import { scale } from '@utils/scaling';
import { Spacer } from '@components/base';
import { useStakeAmbData } from '@features/harbor/hooks/useStakeAmbData';
import { styles } from './styles';

export const StakeAMBTab = ({}) => {
  const { refetch } = useStakeAmbData();
  const renderRefetchController = useMemo(() => {
    return (
      <RefreshControl
        onRefresh={refetch}
        refreshing={false}
        removeClippedSubviews
      />
    );
  }, [refetch]);

  return (
    <View style={styles.main}>
      <ScrollView
        refreshControl={renderRefetchController}
        style={styles.wrapper}
      >
        <StakeInfoContainer />
        <Spacer value={scale(15)} />
        <TiersInfoContainer />
      </ScrollView>
    </View>
  );
};
