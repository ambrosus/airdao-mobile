import React, { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import { Row, Spacer, Text } from '@components/base';
import { SuccessIcon } from '@components/svg/icons/v2/harbor';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { PrimaryButton } from '@components/modular';
import { useTransactionDetails } from '@hooks';
import { Transaction } from '@models';
import { TokenUtils } from '@utils/token';
import {
  ContentItem,
  CopyHash
} from '@features/harbor/components/modular/preview-success/components';
import { styles } from './styles';
import { FormPreviewDataModel } from '@features/harbor/components/modular/model';

interface ExtraButtonModel {
  title: string;
  onPress: () => void;
  type: 'primary' | 'secondary' | string;
}
interface PreviewSuccessModel {
  extraButton?: ExtraButtonModel | null;
  title: string;
  titleData: React.JSX.Element;
  onClose: () => void;
  transaction: Transaction | { transactionHash: string };
  formPreviewData: FormPreviewDataModel[];
}

export const PreviewSuccess = ({
  extraButton = null,
  title,
  titleData,
  formPreviewData,
  onClose,
  transaction
}: PreviewSuccessModel) => {
  const { data: transactionDetails } = useTransactionDetails(
    // @ts-ignore
    transaction?.transactionHash || ''
  );

  const stakeTransaction = useMemo(() => {
    if (transactionDetails) {
      // @ts-ignore
      return new Transaction(transactionDetails, TokenUtils);
    }
    return null;
  }, [transactionDetails]);

  const date = moment(stakeTransaction?.timestamp).format('DD/MM/YYYY  HH:mm');

  const { t } = useTranslation();

  const RenderPreviewFormData = (
    item: ListRenderItemInfo<FormPreviewDataModel>
  ) => {
    const {
      item: { title, content }
    } = item;
    return <ContentItem title={t(title)} value={content} />;
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Row justifyContent="center">
        <SuccessIcon />
      </Row>

      <Spacer value={scale(8)} />
      <Text fontSize={16} color={COLORS.neutral900}>
        {title}
      </Text>
      <Spacer value={scale(12)} />
      {titleData}
      <Spacer value={scale(12)} />
      <View style={styles.contentWrapper}>
        <FlatList
          contentContainerStyle={styles.listWrapper}
          data={formPreviewData}
          renderItem={RenderPreviewFormData}
        />
        {!!stakeTransaction?.timestamp && (
          <ContentItem
            title={t('common.date')}
            value={
              <Text fontSize={14} color={COLORS.neutral900}>
                {date}
              </Text>
            }
          />
        )}
      </View>
      <Spacer value={scale(12)} />
      {!!stakeTransaction?.timestamp && (
        <CopyHash hash={stakeTransaction.hash || ''} />
      )}
      <Spacer value={scale(12)} />
      <PrimaryButton onPress={onClose}>
        <Text color={COLORS.neutral0}>{t('kosmos.button.close')}</Text>
      </PrimaryButton>
      {!!extraButton && (
        <>
          <Spacer value={scale(8)} />
          <PrimaryButton
            colors={[
              extraButton?.type === 'secondary'
                ? COLORS.neutral200
                : COLORS.brand500
            ]}
            onPress={extraButton.onPress}
          >
            <Text color={COLORS.neutral900}>{t(extraButton.title)}</Text>
          </PrimaryButton>
        </>
      )}
    </View>
  );
};
