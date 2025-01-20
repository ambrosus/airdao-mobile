import React, { useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useBridgeContextData } from '@features/bridge/context';
import { BottomSheetBridgeNetworkSelector } from '@features/bridge/templates/BottomSheetBridgeNetworkSelector';
import { BridgeNetworkPickerProps, ParsedBridge } from '@models/Bridge';
import { scale } from '@utils';
import { styles } from './styles';

export const BridgeNetworkPicker = ({ type }: BridgeNetworkPickerProps) => {
  const isFrom = type === 'from';
  const { variables } = useBridgeContextData();
  const { fromData, destinationData } = variables;
  const choseNetworksRef = useRef<BottomSheetRef>(null);
  const showNetworks = () => {
    choseNetworksRef.current?.show();
  };

  const hideNetworks = () => {
    setTimeout(() => {
      choseNetworksRef.current?.dismiss();
    }, 200);
  };

  const pickerData = isFrom ? fromData : destinationData;

  const onPressItem = (item: ParsedBridge) => {
    pickerData.setter(type, item);
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
        {t(`common.transaction.${type}`)}
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
        type={type}
        onPressItem={onPressItem}
        ref={choseNetworksRef}
      />
    </View>
  );
};
