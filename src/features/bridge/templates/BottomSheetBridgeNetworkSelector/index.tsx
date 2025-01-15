import React, { forwardRef } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { CloseCircleIcon } from '@components/svg/icons/v2';
import { BridgeSelectorItem } from '@components/templates/BridgeSelectorItem';
import { COLORS } from '@constants/colors';
import { useBridgeContextData } from '@features/bridge/context';
import { BridgeSelectorTypes } from '@models/Bridge';
import { verticalScale } from '@utils';
import { styles } from './styles';

interface BottomSheetChoseNetworksProps {
  onPressItem: (item: any) => void;
  selectorType: 'network' | 'token';
  type?: BridgeSelectorTypes;
}

export const BottomSheetBridgeNetworkSelector = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>(({ onPressItem, type: destination, selectorType }, ref) => {
  const { t } = useTranslation();

  const isFrom = selectorType && destination === 'from';

  const { variables } = useBridgeContextData();
  const { bridges, fromData, destinationData } = variables;
  const pickerData = isFrom ? fromData : destinationData;

  // @ts-ignore
  const onClose = () => ref?.current?.dismiss();

  const renderNetworkItem = (network: any) => {
    const { item } = network;
    return (
      <BridgeSelectorItem
        symbol={item.id}
        name={item.name}
        isActive={pickerData.value.id === item.id}
        onPressItem={onPressItem}
        key={item.id}
        item={item}
      />
    );
  };

  return (
    <BottomSheet ref={ref} swiperIconVisible={false}>
      <Spacer value={verticalScale(16)} />
      <Row justifyContent="space-between" style={styles.headerContainer}>
        <Text
          fontSize={18}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {t('bridge.select.network')}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <CloseCircleIcon />
        </TouchableOpacity>
      </Row>
      <Spacer value={verticalScale(16)} />
      <FlatList
        contentContainerStyle={styles.listContainer}
        // @ts-ignore
        data={bridges}
        renderItem={renderNetworkItem}
      />
      <Spacer value={verticalScale(30)} />
    </BottomSheet>
  );
});
