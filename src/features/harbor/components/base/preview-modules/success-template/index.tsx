import React, { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  HarborPreViewData,
  SuccessTemplateDataProps
} from '@features/harbor/components/harbor-preview/model';
import { Row, Spacer, Text } from '@components/base';
import { SuccessIcon } from '@components/svg/icons/v2/harbor';
import { scale } from '@utils/scaling';
import { SuccessTitle } from '@features/harbor/components/base/preview-modules/success-template/success-title';
import { COLORS } from '@constants/colors';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { CopyHash } from './copy-hash';
import { delay } from '@utils/delay';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { styles } from './styes';

export const SuccessTemplate = ({
  data = [],
  modalType,
  transaction,
  onPreviewClose
}: SuccessTemplateDataProps) => {
  const navigation = useNavigation<HarborNavigationProp>();
  const { t } = useTranslation();

  const isWithdrawModal = modalType !== 'stake';

  const titleData = useMemo(
    () => (data && data[0].title ? data[0] : null),
    [data]
  );

  const listData = transaction?.timestamp
    ? [
        ...data,
        {
          name: 'common.date',
          value: transaction?.timestamp
            ? moment(transaction?.timestamp).format('DD/MM/YYYY  HH:mm')
            : ''
        }
      ]
    : data;

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
        data={listData}
        renderItem={RenderItem}
      />
      <Spacer value={scale(12)} />
      {!!transaction?.hash && (
        <Row justifyContent="center">
          <CopyHash hash={transaction?.hash} />
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
