import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer } from '@components/base';
import { TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useBridgeContextData } from '@features/bridge/context';
import { PreviewDataItem } from '@features/bridge/templates/BottomSheetBridgePreview/components/PreviewDataTemplate/components/PreviewDataItem';
import { BridgeNetworksSelected } from '@features/bridge/templates/BridgeNetworksSelected/BridgeNetworksSelected';
import { verticalScale } from '@utils';

interface PreviewDataTemplateModel {
  errorBalance: boolean;
  onAcceptPress: () => void;
  loader: boolean;
}

export const PreviewDataTemplate = ({
  errorBalance,
  onAcceptPress,
  loader
}: PreviewDataTemplateModel) => {
  const { t } = useTranslation();

  const { variables } = useBridgeContextData();
  const { selectedTokenFrom, selectedTokenDestination, bridgePreviewData } =
    variables;
  const { dataToPreview } = bridgePreviewData;
  const buttonTitle = useMemo(() => {
    return errorBalance
      ? t('bridge.insufficient.funds')
      : t('bridge.preview.button');
  }, [errorBalance, t]);

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
      <PrimaryButton onPress={onAcceptPress} disabled={errorBalance || loader}>
        <TextOrSpinner
          loading={loader}
          label={buttonTitle}
          loadingLabel={t('kosmos.button.processing')}
          styles={{
            active: {
              fontSize: 16,
              fontFamily: 'Inter_700Bold',
              color: COLORS.neutral0
            },
            loading: {
              fontSize: 16,
              fontFamily: 'Inter_700Bold',
              color: COLORS.brand600
            }
          }}
        />
      </PrimaryButton>
      <Spacer value={verticalScale(40)} />
    </View>
  );
};
