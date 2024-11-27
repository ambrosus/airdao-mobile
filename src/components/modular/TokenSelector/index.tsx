import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { TokenLogo } from '../TokenLogo';
import { COLORS } from '@constants/colors';
import { SwapStringUtils } from '@features/swap/utils';
import { ArrowBottomFillIcon } from '@components/svg/icons/v2';
import { Token } from '@models';
import { TToken } from '@utils';
import { CryptoCurrencyCode } from '@appTypes';

interface TokenSelectorProps {
  readonly token: TToken;
  readonly onShowBottomSheetTokensListHandle: () => void;
  readonly selectable?: boolean;
}

export const TokenSelector = ({
  token,
  onShowBottomSheetTokensListHandle,
  selectable = true
}: TokenSelectorProps) => {
  const { t } = useTranslation();

  const isToken = useMemo(() => {
    return !!token;
  }, [token]);

  const SAMBSupportedTokenLogo = useMemo(() => {
    if (token.symbol === CryptoCurrencyCode.AMB) {
      return 'AirDAO';
    }

    return SwapStringUtils.extendedLogoVariants(
      (token as Token).tokenNameFromDatabase ?? ''
    );
  }, [token]);

  const onToggleSelectTokenModal = useCallback(() => {
    if (selectable) onShowBottomSheetTokensListHandle();
  }, [selectable, onShowBottomSheetTokensListHandle]);

  return (
    <TouchableOpacity disabled={!selectable} onPress={onToggleSelectTokenModal}>
      <View style={styles.currencySelector}>
        <Row alignItems="center">
          {token && (
            <>
              <TokenLogo scale={0.75} token={SAMBSupportedTokenLogo ?? ''} />
              <Spacer horizontal value={scale(4)} />
            </>
          )}
          <Text
            fontSize={20}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
          >
            {isToken ? token?.symbol : t('swap.select.asset')}
          </Text>
        </Row>
        {selectable && (
          <>
            <Spacer horizontal value={scale(4)} />
            <ArrowBottomFillIcon />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};
