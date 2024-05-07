import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '@components/modular/Bridge/BridgeNetworkSelectors/styles';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { BottomSheetRef } from '@components/composite';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { BridgePairsModel, ParsedBridge } from '@models/Bridge';
import { getBridgePairs } from '@api/bridge/sdk/BridgeSDK';
import { Token } from '@api/bridge/sdk/types';
import { BottomSheetChoseNetworks } from '@components/templates/Bridge/BottomSheetChoseNetworks';

interface BridgeNetworkPickerProps {
  destination: 'from' | 'to';
}

export const BridgeNetworkPicker = ({
  destination
}: BridgeNetworkPickerProps) => {
  const isFrom = destination === 'from';
  const { fromParams, toParams, networksParams, bridgeConfig } =
    useBridgeContextSelector();
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
    const SAMBinAMBAddress = '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F';
    const SAMBinETHAddress = '0x683aae5cD37AC94943D05C19E9109D5876113562';
    const SAMB2inETHAddress = '0xf4fB9BF10E489EA3Edb03E094939341399587b0C';

    const tokenFilter = (tokenPairs: Token[]) => {
      switch (name) {
        case 'amb->eth': {
          const fromAddressIsSAMBinAMB =
            tokenPairs[0].address === SAMBinAMBAddress;
          const toAddressIsSAMBinRTH =
            tokenPairs[1].address === SAMBinETHAddress;
          return !(fromAddressIsSAMBinAMB && toAddressIsSAMBinRTH);
        }
        case 'eth->amb': {
          const fromIsSAMB2inETH = tokenPairs[0].address === SAMB2inETHAddress;
          const toIsSAMBinAMB =
            tokenPairs[1].address === SAMBinAMBAddress &&
            !tokenPairs[1].isNativeCoin;
          return !(fromIsSAMB2inETH && toIsSAMBinAMB);
        }
        default:
          return true;
      }
    };

    const tokenForRender = tokenPair
      .filter((item) => tokenFilter(item))
      .map((tkn) => ({
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
      to: toParams.value.id,
      bridgeConfig
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
