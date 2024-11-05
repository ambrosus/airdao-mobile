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

interface TokenSelectorProps {
  readonly token: TToken;
  readonly onDismissBottomSheet: () => void;
}

export const TokenSelector = ({
  token,
  onDismissBottomSheet
}: TokenSelectorProps) => {
  const { t } = useTranslation();

  const istoken = useMemo(() => {
    return !!token;
  }, [token]);

  const SAMBSupportedTokenLogo = useMemo(() => {
    return SwapStringUtils.extendedLogoVariants((token as Token).symbol ?? '');
  }, [token]);

  const onToggleSelectTokenModal = useCallback(() => {
    onDismissBottomSheet();
  }, [onDismissBottomSheet]);

  return (
    <TouchableOpacity onPress={onToggleSelectTokenModal}>
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
            {istoken ? token?.symbol : t('swap.select.asset')}
          </Text>
        </Row>
        <Spacer horizontal value={scale(4)} />
        <ArrowBottomFillIcon />
      </View>
    </TouchableOpacity>
  );
};
