import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { SelectedTokensKeys } from '@features/swap/types';
import { scale } from '@utils/scaling';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { SwapStringUtils } from '@features/swap/utils';
import { ArrowBottomFillIcon } from '@components/svg/icons/v2';

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

  const SAMBSupportedTokenLogo = SwapStringUtils.extendedLogoVariants(
    selectedTokens[type]?.symbol ?? ''
  );

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
