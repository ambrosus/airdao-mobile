import React, { useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { t } from 'i18next';
import { Token } from '@models';
import { CryptoCurrencyCode } from '@appTypes';
import { useERC20Balance, useUSDPrice, useWallet } from '@hooks';
import { Button, Row, Spacer, Text } from '@components/base';
import { ShimmerLoader } from '@components/animations';
import { WalletOutlineIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { scale } from '@utils/scaling';
import { useAMBEntity } from '@features/send-funds/lib/hooks';

interface BalanceRowProps {
  readonly token: Token;
  readonly value: string;
  readonly dispatch: boolean;
  readonly onChangeText?: (text: string) => void;
  readonly onPressMaxAmount: (amount: string) => void;
}

export const BalanceRow = ({
  token,
  value,
  onPressMaxAmount,
  dispatch,
  onChangeText
}: BalanceRowProps): JSX.Element => {
  const { wallet } = useWallet();
  const _AMBEntity = useAMBEntity(wallet?.address ?? '');

  const isAMBEntity = useMemo(
    () => token?.address === _AMBEntity.address,
    [_AMBEntity.address, token?.address]
  );

  const address = useMemo(() => {
    return isAMBEntity ? ethers.constants.AddressZero : token.address;
  }, [isAMBEntity, token.address]);

  const { balance: bnBalance, isFetching } = useERC20Balance(address);

  const normalizedTokenBalance = useMemo(() => {
    if (bnBalance) {
      return NumberUtils.numberToTransformedLocale(
        ethers.utils.formatEther(bnBalance?._hex)
      );
    }

    return '0';
  }, [bnBalance]);

  const disabled = useMemo(() => {
    return bnBalance?.isZero() || !token;
  }, [token, bnBalance]);

  const maximumTokenBalance = useMemo(() => {
    return !token ? '0' : normalizedTokenBalance;
  }, [normalizedTokenBalance, token]);

  const USDTokenPrice = useUSDPrice(
    Number(NumberUtils.limitDecimalCount(value, 2)),
    token.symbol as CryptoCurrencyCode
  );

  const isUSDPriceNegative = useMemo(() => {
    return USDTokenPrice < 0;
  }, [USDTokenPrice]);

  const containerJustifyContent = useMemo(() => {
    return isUSDPriceNegative ? 'flex-end' : 'space-between';
  }, [isUSDPriceNegative]);

  const error = useMemo(() => {
    if (!bnBalance || !token || value.trim() === '') return false;

    const bnInputBalance = bnBalance?._hex;
    const bnSelectedAmount = ethers.utils.parseEther(value);

    return bnSelectedAmount.gt(bnInputBalance);
  }, [bnBalance, token, value]);

  const onSelectMaxTokensAmountPress = useCallback(() => {
    if (bnBalance) {
      const amount = NumberUtils.limitDecimalCount(
        ethers.utils.formatUnits(bnBalance?._hex, token.decimals),
        token.decimals ?? 18
      );

      if (!dispatch && onPressMaxAmount) {
        (onPressMaxAmount as (amount: string) => void)(amount);
      } else if (dispatch && onChangeText) {
        (onChangeText as (text: string) => void)(amount);
      }
    }
  }, [bnBalance, dispatch, onChangeText, onPressMaxAmount, token.decimals]);

  return (
    <Row alignItems="center" justifyContent={containerJustifyContent}>
      <Row alignItems="center">
        <Row alignItems="center">
          <WalletOutlineIcon
            color={error ? COLORS.error500 : COLORS.neutral500}
          />
          <Spacer horizontal value={4} />
          {isFetching ? (
            <ShimmerLoader width={45} height={12} />
          ) : (
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={error ? COLORS.error500 : COLORS.neutral500}
            >
              {maximumTokenBalance}
            </Text>
          )}
        </Row>

        {!disabled && (
          <>
            <Spacer horizontal value={scale(4)} />
            <Button onPress={onSelectMaxTokensAmountPress}>
              <Text
                fontSize={15}
                fontFamily="Inter_500Medium"
                color={COLORS.brand600}
              >
                {t('swap.text.button.max')}
              </Text>
            </Button>
          </>
        )}
      </Row>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral500}
      >
        ${NumberUtils.limitDecimalCount(USDTokenPrice, 2)}
      </Text>
    </Row>
  );
};
