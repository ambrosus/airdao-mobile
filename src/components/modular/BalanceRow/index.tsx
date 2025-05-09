import { useCallback, useEffect, useMemo } from 'react';
import { BigNumber, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { ShimmerLoader } from '@components/animations';
import { Button, Row, Spacer, Text } from '@components/base';
import { WalletOutlineIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { useWalletStore } from '@entities/wallet';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import { useERC20Balance, useUSDPrice } from '@hooks';
import { Token } from '@models';
import { NumberUtils, scale } from '@utils';

interface BalanceRowProps {
  readonly token: Token;
  readonly value: string;
  readonly dispatch: boolean;
  readonly onChangeText?: (text: string) => void;
  readonly onPressMaxAmount: (amount: string) => void;
  tokenDecimal?: number;
  isRequiredRefetchBalance?: boolean;
}

export const BalanceRow = ({
  token,
  value,
  onPressMaxAmount,
  dispatch,
  onChangeText,
  tokenDecimal,
  isRequiredRefetchBalance
}: BalanceRowProps): JSX.Element => {
  const { wallet } = useWalletStore();
  const _AMBEntity = useAMBEntity(wallet?.address ?? '');

  const isAMBEntity = useMemo(
    () => token?.address === _AMBEntity.address,
    [_AMBEntity.address, token?.address]
  );

  const address = useMemo(() => {
    return isAMBEntity ? ethers.constants.AddressZero : token.address;
  }, [isAMBEntity, token.address]);

  const tokenBalanceIsBigNumber = token.balance instanceof BigNumber;

  const {
    balance: _balance,
    isFetching,
    refetch
  } = useERC20Balance(address, undefined, !tokenBalanceIsBigNumber);

  const bnBalance = tokenBalanceIsBigNumber ? token.balance : _balance;
  useEffect(() => {
    if (isRequiredRefetchBalance) refetch();
  }, [isRequiredRefetchBalance, refetch]);

  const normalizedTokenBalance = useMemo(() => {
    if (bnBalance) {
      return NumberUtils.numberToTransformedLocale(
        tokenDecimal
          ? formatUnits(bnBalance?._hex, tokenDecimal)
          : ethers.utils.formatEther(bnBalance?._hex)
      );
    }

    return '0';
  }, [bnBalance, tokenDecimal]);

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

  const error = useMemo(() => {
    if (!bnBalance || !token || value.trim() === '' || isFetching) return false;

    const bnInputBalance = bnBalance?._hex;
    const bnSelectedAmount = tokenDecimal
      ? ethers.utils.parseUnits(value, tokenDecimal)
      : ethers.utils.parseEther(value);

    return bnSelectedAmount.gt(bnInputBalance);
  }, [bnBalance, isFetching, token, tokenDecimal, value]);

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

  const justifyContentType = useMemo<'flex-start' | 'space-between'>(() => {
    return !Number.isNaN(USDTokenPrice) ? 'space-between' : 'flex-start';
  }, [USDTokenPrice]);

  return (
    <Row width="100%" alignItems="center" justifyContent={justifyContentType}>
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
      {!Number.isNaN(USDTokenPrice) && (
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          ${NumberUtils.limitDecimalCount(USDTokenPrice, 2)}
        </Text>
      )}
    </Row>
  );
};
