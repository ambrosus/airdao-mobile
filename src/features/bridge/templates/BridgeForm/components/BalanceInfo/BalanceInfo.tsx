import { Row, Spacer, Spinner, Text } from '@components/base';
import { styles } from './BalanceInfo.styles';
import { COLORS } from '@constants/colors';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeContextData } from '@features/bridge/context';
import { formatUnits } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';
import { DECIMAL_LIMIT } from '@constants/variables';

interface BalanceInfoModel {
  onMaxPress: () => void;
}

const BalanceInfo = ({ onMaxPress }: BalanceInfoModel) => {
  const { t } = useTranslation();
  const {
    tokenParams: {
      loader,
      value: { renderTokenItem }
    }
  } = useBridgeContextData();

  const balance = NumberUtils.limitDecimalCount(
    formatUnits(renderTokenItem.balance || 0, renderTokenItem.decimals),
    DECIMAL_LIMIT.CRYPTO
  );
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
        !!balance && (
          <>
            <Text
              fontSize={14}
              fontFamily="Inter_400Regular"
              color={COLORS.alphaBlack60}
            >
              {`${balance} ${renderTokenItem.symbol}`}
            </Text>

            {Number(balance) > 0 && (
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
