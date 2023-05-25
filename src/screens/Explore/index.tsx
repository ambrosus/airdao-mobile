import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SearchAddress } from '@components/templates';
import { verticalScale } from '@utils/scaling';
import { ExploreTabParamsList } from '@appTypes/navigation';
import { KeyboardDismissingView } from '@components/base';

export const ExploreScreen = () => {
  const { params } = useRoute<RouteProp<ExploreTabParamsList>>();
  const [addressFromParams, setAddressFromParams] = useState('');

  useEffect(() => {
    if (params?.address) setAddressFromParams(params.address);
  }, [params?.address]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: verticalScale(12) }}
      testID="explore-screen"
    >
      <KeyboardDismissingView style={{ flex: 1 }}>
        <SearchAddress initialValue={addressFromParams} />
      </KeyboardDismissingView>
    </SafeAreaView>
  );
};
