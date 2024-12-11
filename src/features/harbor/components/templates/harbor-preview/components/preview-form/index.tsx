import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { scale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { PreviewDataModel } from '@features/harbor/components/templates/harbor-preview/models';
import { TextOrSpinner } from '@components/composite';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';

interface PreviewFormModel {
  previewData: PreviewDataModel;
  onAcceptPress: (data: PreviewDataModel) => void;
  loader: boolean;
}

export const PreviewForm = ({
  previewData,
  onAcceptPress,
  loader
}: PreviewFormModel) => {
  const { t } = useTranslation();

  const { amount, receiveAmount, fromAddress, apy, receiveToken, token } =
    previewData;

  return (
    <>
      <View style={styles.wrapper}>
        <Row justifyContent="space-between">
          <Text style={styles.title}>
            {t('harbor.stake.amount.preview.title')}
          </Text>
          <Row alignItems="center">
            <TokenLogo token={token} scale={0.8} />
            <Text style={styles.valueText}>
              {NumberUtils.limitDecimalCount(amount, 2)} {token}
            </Text>
          </Row>
        </Row>
        <Spacer value={scale(16)} />

        <Row justifyContent="space-between">
          <Text style={styles.title}>
            {t('harbor.receive.amount.preview.title')}
          </Text>
          <Row alignItems="center">
            <TokenLogo token={receiveToken} scale={0.8} />
            <Text style={styles.valueText}>
              {NumberUtils.limitDecimalCount(receiveAmount, 2)} {receiveToken}
            </Text>
          </Row>
        </Row>
        <Spacer value={scale(16)} />

        <Row justifyContent="space-between">
          <Row justifyContent="center">
            <Text style={styles.title}>{t('harbor.stake.from')}</Text>
          </Row>
          <Text style={styles.valueText}>
            {StringUtils.formatAddress(fromAddress, 10, 4)}
          </Text>
        </Row>
        <Spacer value={scale(16)} />

        <Row justifyContent="space-between">
          <Text style={styles.title}>{t('harbor.stake.apy')}</Text>
          <Row>
            <Text style={{ ...styles.valueText, ...styles.apy }}>{apy} %</Text>
          </Row>
        </Row>
      </View>
      <PrimaryButton onPress={() => onAcceptPress(previewData)}>
        <TextOrSpinner
          spinnerColor={COLORS.neutral0}
          spinnerSize={'small'}
          loading={loader}
          styles={{
            active: styles.regularBtnStyle,
            loading: styles.loadingBtnStyle
          }}
          loadingLabel={t('kosmos.button.processing')}
          label={t('staking.header')}
        />
      </PrimaryButton>
    </>
  );
};
