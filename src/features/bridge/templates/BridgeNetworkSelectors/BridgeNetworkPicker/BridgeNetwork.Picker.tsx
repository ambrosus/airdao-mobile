import React, { useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../../BridgeNetworkSelectors/styles';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { BottomSheetRef } from '@components/composite';
import { useBridgeContextData } from '@features/bridge/context';
import { BridgeNetworkPickerProps, ParsedBridge } from '@models/Bridge';
import { BottomSheetBridgeNetworkSelector } from '../../BottomSheetBridgeNetworkSelector';
import { scale } from '@utils/scaling';

export const BridgeNetworkPicker = ({
  destination
}: BridgeNetworkPickerProps) => {
  const isFrom = destination === 'from';
  const { fromParams, toParams } = useBridgeContextData();
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
      <Spacer value={scale(2)} />
      <Button onPress={showNetworks} style={styles.select}>
        <Row
          style={styles.pickerContainer}
          alignItems="center"
          justifyContent="space-between"
        >
          <TokenLogo
            scale={0.8}
            token={pickerData.value.id}
            overrideIconVariants={{ eth: 'blue' }}
          />
          <Text
            fontSize={scale(15)}
            fontFamily="Inter_500Medium"
            color={COLORS.black}
          >
            {pickerData.value.name}
          </Text>

          <ChevronDownIcon
            color={COLORS.brand500}
            rotate={'270deg'}
            scale={0.8}
          />
        </Row>
      </Button>
      <BottomSheetBridgeNetworkSelector
        selectorType={'network'}
        destination={destination}
        onPressItem={onPressItem}
        ref={choseNetworksRef}
      />
    </View>
  );
};
