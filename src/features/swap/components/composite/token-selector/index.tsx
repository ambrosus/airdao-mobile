import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { ArrowBottomFillIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { SelectedTokensKeys } from '@features/swap/types';
import { SwapStringUtils } from '@features/swap/utils';
import { getTokenNameFromDatabase, scale } from '@utils';
import { styles } from './styles';

interface TokenSelectorProps {
  readonly type: SelectedTokensKeys;
}

export const TokenSelector = ({ type }: TokenSelectorProps) => {
  const { t } = useTranslation();
  const { selectedTokens } = useSwapContextSelector();
  const { onShowBottomSheetByKey } = useSwapBottomSheetHandler();

  const isSelectedToken = useMemo(() => {
    return !!selectedTokens[type];
  }, [selectedTokens, type]);

  const tokenLogoHref = useMemo(
    () =>
      getTokenNameFromDatabase(selectedTokens[type].address) !== 'unknown'
        ? selectedTokens[type].symbol
        : selectedTokens[type].address,
    [selectedTokens, type]
  );

  const SAMBSupportedTokenLogo =
    SwapStringUtils.extendedLogoVariants(tokenLogoHref);

  const onToggleSelectTokenModal = useCallback(() => {
    onShowBottomSheetByKey(type);
  }, [onShowBottomSheetByKey, type]);

  return (
    <TouchableOpacity onPress={onToggleSelectTokenModal}>
      <View style={styles.currencySelector}>
        <Row alignItems="center">
          {isSelectedToken && (
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
            {isSelectedToken
              ? selectedTokens[type]?.symbol
              : t('swap.select.asset')}
          </Text>
        </Row>
        <Spacer horizontal value={scale(4)} />
        <ArrowBottomFillIcon />
      </View>
    </TouchableOpacity>
  );
};
