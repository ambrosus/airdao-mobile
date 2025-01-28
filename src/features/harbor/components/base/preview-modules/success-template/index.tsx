import React, { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { SuccessIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { SuccessTitle } from '@features/harbor/components/base/preview-modules/success-template/success-title';
import {
  HarborPreViewData,
  SuccessTemplateDataProps
} from '@features/harbor/components/harbor-preview/model';
import { delay, scale } from '@utils';
import { CopyHash } from './copy-hash';
import { styles } from './styes';

export const SuccessTemplate = ({
  data = [],
  modalType,
  transactionHash,
  onPreviewClose
}: SuccessTemplateDataProps) => {
  const navigation = useNavigation<HarborNavigationProp>();
  const { t } = useTranslation();

  const isStakeModal = modalType === 'stake';
  const isWithdrawModal = !isStakeModal;

  const titleData = useMemo(
    () => (data && data[0].title ? data[0] : null),
    [data]
  );

  const goToMyRequests = async () => {
    onPreviewClose();
    await delay(300);
    navigation.navigate('WithdrawRequests');
  };

  const RenderItem = (renderItem: ListRenderItemInfo<HarborPreViewData>) => {
    const { item } = renderItem;
    if (item.title || !item.value) {
      return <></>;
    }
    return (
      <View style={{ paddingVertical: scale(6) }}>
        <Row justifyContent="space-between">
          <Text fontSize={scale(14)} color={COLORS.neutral900}>
            {t(item.name)}
          </Text>
          <Text
            fontSize={scale(14)}
            color={COLORS.neutral900}
            style={item.textStyle || {}}
          >
            {item.value}
          </Text>
        </Row>
      </View>
    );
  };
  return (
    <View>
      <Row justifyContent="center">
        <SuccessIcon />
      </Row>
      {titleData && <SuccessTitle titleData={titleData} />}
      <Spacer value={scale(8)} />
      <FlatList
        contentContainerStyle={styles.wrapper}
        data={data}
        renderItem={RenderItem}
      />
      <Spacer value={scale(12)} />
      {!!transactionHash && (
        <Row justifyContent="center">
          <CopyHash hash={transactionHash} />
        </Row>
      )}
      <Spacer value={scale(12)} />
      <PrimaryButton onPress={onPreviewClose}>
        <Text fontSize={scale(14)} color={COLORS.neutral0}>
          {t('kosmos.button.close')}
        </Text>
      </PrimaryButton>
      {isWithdrawModal && (
        <>
          <Spacer value={scale(12)} />
          <SecondaryButton onPress={goToMyRequests}>
            <Text fontSize={scale(14)} color={COLORS.neutral900}>
              {t('harbor.requests.header')}
            </Text>
          </SecondaryButton>
        </>
      )}
      <Spacer value={scale(12)} />
    </View>
  );
};
