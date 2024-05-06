import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '@components/modular/Bridge/BridgeNetworkSelectors/styles';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetChoseNetworks } from '@components/templates';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { BridgePairsModel, ParsedBridge } from '@models/Bridge';
import { getBridgePairs } from '@api/bridge/sdk/BridgeSDK';

interface BridgeNetworkPickerProps {
  destination: 'from' | 'to';
}

export const BridgeNetworkPicker = ({
  destination
}: BridgeNetworkPickerProps) => {
  const isFrom = destination === 'from';
  const { fromParams, toParams, networksParams } = useBridgeContextSelector();
  const choseNetworksRef = useRef<BottomSheetRef>(null);
  const showNetworks = () => {
    choseNetworksRef.current?.show();
  };

  const hideNetworks = () => {
    setTimeout(() => {
      choseNetworksRef.current?.dismiss();
    }, 200);
  };

  const parseNetworkParams = (pair: BridgePairsModel) => {
    const { name, pairs: tokenPair, provider } = pair;

    const tokenForRender = tokenPair.map((tkn) => ({
      renderTokenItem: tkn[0],
      name,
      pairs: tkn,
      provider
    }));
    networksParams.setter(tokenForRender);
  };

  useEffect(() => {
    getBridgePairs({
      walletHash: '',
      // @ts-ignore
      from: fromParams.value.id,
      // @ts-ignore
      to: toParams.value.id
    }).then((r) => {
      return parseNetworkParams(r);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromParams.value.id, toParams.value.id]);

  const pickerData = isFrom ? fromParams : toParams;

  const onPressItem = (item: ParsedBridge) => {
    pickerData.setter(item);
    hideNetworks();
  };

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral900}
      >
        {t(`common.transaction.${destination}`)}
      </Text>
      <Button onPress={showNetworks} style={styles.select}>
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center" style={styles.selectInnerRowGap}>
            <TokenLogo
              scale={pickerData.value.id === 'amb' ? 0.6 : 0.65}
              token={pickerData.value.id}
              overrideIconVariants={{ eth: 'blue' }}
            />
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.black}
            >
              {pickerData.value.name}
            </Text>
          </Row>

          <ChevronDownIcon color={COLORS.black} />
        </Row>
      </Button>
      <BottomSheetChoseNetworks
        destination={destination}
        onPressItem={onPressItem}
        ref={choseNetworksRef}
      />
    </View>
  );
};
