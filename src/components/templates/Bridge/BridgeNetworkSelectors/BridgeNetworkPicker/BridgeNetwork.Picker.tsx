import React, { useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../../BridgeNetworkSelectors/styles';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { BottomSheetRef } from '@components/composite';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { BridgeNetworkPickerProps, ParsedBridge } from '@models/Bridge';
import { BottomSheetBridgeItemSelector } from '../../BottomSheetBridgeItemSelector';

export const BridgeNetworkPicker = ({
  destination
}: BridgeNetworkPickerProps) => {
  const isFrom = destination === 'from';
  const { fromParams, toParams } = useBridgeContextSelector();
  const choseNetworksRef = useRef<BottomSheetRef>(null);
  const showNetworks = () => {
    choseNetworksRef.current?.show();
  };

  const hideNetworks = () => {
    setTimeout(() => {
      choseNetworksRef.current?.dismiss();
    }, 200);
  };

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
      <BottomSheetBridgeItemSelector
        selectorType={'network'}
        destination={destination}
        onPressItem={onPressItem}
        ref={choseNetworksRef}
      />
    </View>
  );
};
