import { Row, Spacer, Spinner, Text } from '@components/base';
import { styles } from './BalanceInfo.styles';
import { COLORS } from '@constants/colors';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface BalanceInfoModel {
  loader: boolean;
  tokenBalance: string | number;
  tokenSymbol: string;
  onMaxPress: () => void;
}

const BalanceInfo = ({
  loader,
  tokenBalance,
  tokenSymbol,
  onMaxPress
}: BalanceInfoModel) => {
  const { t } = useTranslation();

  return (
    <Row style={styles.balanceContainer} alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_400Regular"
        color={COLORS.alphaBlack60}
      >
        {t('common.balance')}:
      </Text>
      {loader ? (
        <>
          <Spacer value={10} horizontal />
          <Spinner customSize={15} />
        </>
      ) : (
        tokenBalance && (
          <>
            <Text
              fontSize={14}
              fontFamily="Inter_400Regular"
              color={COLORS.alphaBlack60}
            >
              {`${tokenBalance} ${tokenSymbol}`}
            </Text>

            {Number(tokenBalance) > 0 && (
              <Text
                fontSize={14}
                fontFamily="Inter_700Bold"
                color={COLORS.sapphireBlue}
                onPress={onMaxPress}
              >
                {t('bridge.preview.button.max')}
              </Text>
            )}
          </>
        )
      )}
    </Row>
  );
};

export default BalanceInfo;
