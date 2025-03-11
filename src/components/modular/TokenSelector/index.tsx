import { useCallback, useMemo } from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes/blockchain';
import { Row, Spacer, Text } from '@components/base';
import { ArrowBottomFillIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { TToken, wrapTokenIcon, scale } from '@utils';
import { TokenLogo } from '../TokenLogo';
import { styles } from './styles';

interface TokenSelectorProps {
  readonly token: TToken;
  readonly onShowBottomSheetTokensListHandle: () => void;
  readonly selectable?: boolean;
  customTokenStyle?: TextStyle;
}

export const TokenSelector = ({
  token,
  onShowBottomSheetTokensListHandle,
  selectable = true,
  customTokenStyle
}: TokenSelectorProps) => {
  const { t } = useTranslation();

  const isToken = useMemo(() => {
    return !!token;
  }, [token]);
  const SAMBSupportedTokenLogo = wrapTokenIcon(token);

  const onToggleSelectTokenModal = useCallback(() => {
    if (selectable) onShowBottomSheetTokensListHandle();
  }, [selectable, onShowBottomSheetTokensListHandle]);

  return (
    <TouchableOpacity
      disabled={!selectable}
      style={styles.container}
      onPress={onToggleSelectTokenModal}
    >
      <View style={styles.currencySelector}>
        <Row alignItems="center">
          {token && (
            <>
              <TokenLogo
                scale={token.symbol === CryptoCurrencyCode.HBR ? 0.9 : 0.8}
                token={SAMBSupportedTokenLogo ?? ''}
              />
              <Spacer horizontal value={scale(4)} />
            </>
          )}
          <Text
            fontSize={20}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
            style={customTokenStyle || {}}
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
