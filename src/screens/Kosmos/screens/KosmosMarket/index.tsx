import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native';
import { Header } from '@components/composite';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketHeaderDetails } from '@features/kosmos/components/base';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { HomeParamsList } from '@appTypes';

type KosmosMarketScreenProps = NativeStackScreenProps<
  HomeParamsList,
  'KosmosMarketScreen'
>;

export const KosmosMarketScreen = ({ route }: KosmosMarketScreenProps) => {
  const { token } = useExtractToken(route.params.market.payoutToken);

  const renderHeaderMiddleContent = useMemo(() => {
    const tokenSymbol = token?.symbol ?? '';
    return <MarketHeaderDetails tokenSymbol={tokenSymbol} />;
  }, [token?.symbol]);

  return (
    <SafeAreaView>
      <Header backIconVisible title={renderHeaderMiddleContent} />
    </SafeAreaView>
  );
};
