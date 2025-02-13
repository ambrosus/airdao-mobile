import { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { TextOrSpinner } from '@components/composite';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useWalletStore } from '@entities/wallet';
import {
  FormTemplateProps,
  HarborPreViewData
} from '@features/harbor/components/templates/harbor-preview/model';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import { scale } from '@utils';
import { styles } from './styles';

export const FormTemplate = ({
  data,
  buttonTitle,
  onAcceptPress,
  loading,
  estimatedGas,
  type
}: FormTemplateProps) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const {
    balance: { formattedBalance }
  } = useAMBEntity(wallet?.address ?? '');

  const onPress = () => {
    if (loading) return;
    onAcceptPress();
  };
  const RenderPreviewFormData = (
    formItem: ListRenderItemInfo<HarborPreViewData>
  ) => {
    const { item } = formItem;

    if (!data) {
      return null;
    }

    return (
      <Row
        justifyContent="space-between"
        style={{ paddingVertical: scale(10) }}
      >
        {!!item?.name && (
          <Text
            fontFamily={'Inter_500Medium'}
            fontSize={scale(14)}
            color={COLORS.neutral600}
          >
            {t(item.name)}
          </Text>
        )}
        <Row alignItems="center">
          {!!item?.symbol && (
            <>
              <TokenLogo scale={0.7} token={item.symbol} />
              <Spacer horizontal value={scale(4)} />
            </>
          )}
          <Text
            fontSize={scale(14)}
            color={COLORS.neutral900}
            style={item?.textStyle || {}}
          >
            {item.value}{' '}
          </Text>
          {!!item.timeSymbol && (
            <Text fontSize={scale(14)} color={COLORS.neutral900}>
              {t(item.timeSymbol)}
            </Text>
          )}
          {!!item.symbol && (
            <Text fontSize={scale(14)} color={COLORS.neutral900}>
              {item.symbol}
            </Text>
          )}
        </Row>
      </Row>
    );
  };

  const buttonLabel = useMemo(() => {
    const parsedGas = ethers.utils.parseEther(estimatedGas ?? '0');
    const parsedBalance = ethers.utils.parseEther(formattedBalance);

    if (type === 'stake') {
      const amountToTransfer = data?.find(
        (item) => item.name === 'harbor.staked.amount'
      )?.value;

      const bnAmountToTransfer = ethers.utils.parseEther(
        amountToTransfer ?? '0'
      );
      const amountWithGas = bnAmountToTransfer.add(parsedGas);
      if (parsedBalance.lt(amountWithGas)) {
        return t('bridge.insufficient.funds');
      }
    } else {
      if (parsedGas.gt(parsedBalance)) {
        return t('bridge.insufficient.funds');
      }
    }

    return buttonTitle;
  }, [estimatedGas, formattedBalance, data, buttonTitle, type, t]);

  const disabled = useMemo(() => {
    return buttonLabel === t('bridge.insufficient.funds');
  }, [buttonLabel, t]);

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.wrapper}
        data={data}
        renderItem={RenderPreviewFormData}
      />
      <Spacer value={scale(20)} />
      <PrimaryButton disabled={disabled} onPress={onPress}>
        <TextOrSpinner
          loading={loading}
          label={buttonLabel}
          spinnerColor={COLORS.neutral0}
          loadingLabel={t('harbor.button.processing')}
          styles={{
            loading: {
              color: COLORS.neutral0
            },
            active: {
              color: disabled ? COLORS.neutral500 : COLORS.neutral0
            }
          }}
        />
      </PrimaryButton>
      <Spacer value={scale(12)} />
    </View>
  );
};
