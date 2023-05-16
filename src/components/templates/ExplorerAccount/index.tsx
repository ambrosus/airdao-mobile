import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { ExplorerAccount } from '@models/Explorer';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks/query';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { useLists } from '@contexts/ListsContext';
import { StarFilledIcon } from '@components/svg/icons';
import { CopyToClipboardButton } from '@components/composite';

interface ExplorerAccountProps {
  account: ExplorerAccount;
  totalSupply: number;
  listInfoVisible?: boolean;
  watchlistDisplayType?: 'explorer' | 'details';
  nameVisible?: boolean;
}

export const ExplorerAccountView = (
  props: ExplorerAccountProps
): JSX.Element => {
  const {
    account,
    totalSupply,
    listInfoVisible,
    nameVisible,
    watchlistDisplayType = 'details'
  } = props;
  const { listsOfAddressGroup } = useLists((v) => v);

  const { data } = useAMBPrice();
  const ambPriceUSD = data?.priceUSD || 0;

  const AMBBalance = account.ambBalance;
  const USDBalance = AMBBalance * ambPriceUSD;
  const percentage = (AMBBalance / totalSupply) * 100;
  const listsWithAccount = listsOfAddressGroup.filter(
    (list) => list.accounts.indexOfItem(account, 'address') > -1
  );

  const renderListAndWalletInfo = () => {
    return (
      <>
        <Spacer horizontal value={scale(13)} />

        <Row alignItems="center">
          {listInfoVisible &&
            listsWithAccount.length > 0 &&
            (listsWithAccount.length === 1 ? (
              <Text
                color="#828282"
                fontFamily="Inter_400Regular"
                fontSize={13}
                fontWeight="400"
              >
                Added to {listsWithAccount[0].name}
              </Text>
            ) : (
              <Text
                color="#828282"
                fontFamily="Inter_400Regular"
                fontSize={13}
                fontWeight="400"
              >
                Added to {listsWithAccount.length} lists
              </Text>
            ))}
          {account.isOnWatchlist && (
            <>
              {watchlistDisplayType === 'details' ? (
                <Text
                  color="#828282"
                  fontFamily="Inter_400Regular"
                  fontSize={13}
                  fontWeight="400"
                >
                  {listsWithAccount.length > 0 && listInfoVisible ? ' ~ ' : ''}{' '}
                  Watchlisted
                </Text>
              ) : (
                <Row alignItems="center">
                  <StarFilledIcon color="#FF5E0D" scale={0.75} />
                  <Text
                    color="#FF5E0D"
                    fontFamily="Inter_400Regular"
                    fontSize={13}
                    fontWeight="400"
                  >
                    Added to my watchlists
                  </Text>
                </Row>
              )}
            </>
          )}
        </Row>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {nameVisible && (
        <Row alignItems="center">
          <Text fontFamily="Inter_600SemiBold" fontSize={15}>
            {account.name}
          </Text>
          {renderListAndWalletInfo()}
        </Row>
      )}
      <Spacer value={verticalScale(13)} />
      <Row alignItems="center">
        <CopyToClipboardButton
          testID="CopyToClipboardButton"
          textToDisplay={StringUtils.formatAddress(account.address, 11, 5)}
          textToCopy={account.address}
          textProps={{
            fontSize: 15,
            fontFamily: 'Inter_600SemiBold'
          }}
        />
        {!nameVisible && renderListAndWalletInfo()}
      </Row>
      <Spacer value={verticalScale(12)} />
      <Text fontFamily="Mersad_600SemiBold" fontSize={36}>
        ${NumberUtils.formatNumber(USDBalance)}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontSize={12} fontWeight="500">
        {NumberUtils.formatNumber(AMBBalance, 2)} AMB
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontSize={11} fontWeight="400">
        Holding {NumberUtils.formatNumber(percentage, 2)}% Supply
      </Text>
    </View>
  );
};

export * from './ExplorerAccount.Transactions';
export * from './ExplorerAccount.TransactionItem';
