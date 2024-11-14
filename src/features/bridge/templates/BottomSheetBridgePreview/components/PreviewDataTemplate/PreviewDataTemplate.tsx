import { FlatList, View } from 'react-native';
import { verticalScale } from '@utils/scaling';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BridgeNetworksSelected } from '@features/bridge/templates/BridgeNetworksSelected/BridgeNetworksSelected';
import { PreviewDataItem } from '@features/bridge/templates/BottomSheetBridgePreview/components/PreviewDataTemplate/components/PreviewDataItem';
import { PrimaryButton } from '@components/modular';
import React from 'react';
import { useBridgeContextData } from '@features/bridge/context';
import { useTranslation } from 'react-i18next';

interface PreviewDataTemplateModel {
  errorBalance: boolean;
  onAcceptPress: () => Promise<void>;
}

export const PreviewDataTemplate = ({
  errorBalance,
  onAcceptPress
}: PreviewDataTemplateModel) => {
  const { t } = useTranslation();

  const { variables } = useBridgeContextData();
  const { selectedTokenFrom, selectedTokenDestination, bridgePreviewData } =
    variables;
  const { dataToPreview } = bridgePreviewData;
  const buttonTitle = errorBalance
    ? t('bridge.insufficient.funds')
    : t('bridge.preview.button');

  return (
    <View>
      <BridgeNetworksSelected
        networkFrom={selectedTokenFrom.network}
        networkTo={selectedTokenDestination.network}
      />
      <Spacer value={verticalScale(18)} />
      <FlatList
        data={dataToPreview}
        renderItem={(item) => <PreviewDataItem item={item} />}
      />
      <Spacer value={verticalScale(15)} />
      <PrimaryButton onPress={onAcceptPress} disabled={errorBalance}>
        <Text
          fontFamily="Inter_600SemiBold"
          color={errorBalance ? COLORS.neutral400 : COLORS.neutral0}
          fontSize={16}
        >
          {buttonTitle}
        </Text>
      </PrimaryButton>
      <Spacer value={verticalScale(40)} />
    </View>
  );
};
