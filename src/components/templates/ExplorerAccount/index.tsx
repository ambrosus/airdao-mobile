import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { ExplorerAccount } from '@models/Explorer';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks/query';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetRef, CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AddWalletToList } from '../AddWalletToList';
import { BottomSheetWithHeader } from '@components/modular';
import { useFullscreenModalHeight } from '@hooks/useFullscreenModalHeight';
import { useWatchlist } from '@hooks';

interface ExplorerAccountProps {
  account: ExplorerAccount;
  listInfoVisible?: boolean;
  nameVisible?: boolean;
  onToggleWatchlist?: (isOnWatchlist: boolean) => unknown;
}

export const ExplorerAccountView = (
  props: ExplorerAccountProps
): JSX.Element => {
  const { account, listInfoVisible, nameVisible, onToggleWatchlist } = props;
  const { listsOfAddressGroup } = useLists((v) => v);
  const fullscreenHeight = useFullscreenModalHeight();
  const { addToWatchlist, removeFromWatchlist } = useWatchlist();

  const { data } = useAMBPrice();
  const ambPriceUSD = data?.priceUSD || 0;

  const addToListModal = useRef<BottomSheetRef>(null);

  const AMBBalance = account.ambBalance;
  const USDBalance = AMBBalance * ambPriceUSD;
  const listsWithAccount = listsOfAddressGroup.filter(
    (list) => list.accounts.indexOfItem(account, 'address') > -1
  );

  const showAddToList = () => {
    addToListModal.current?.show();
  };

  const hideAddToList = () => {
    setTimeout(() => addToListModal.current?.dismiss(), 250);
  };

  const toggleWatchlist = async () => {
    if (account) {
      if (account.isOnWatchlist) {
        removeFromWatchlist(account);
        if (typeof onToggleWatchlist === 'function') onToggleWatchlist(false);
      } else {
        addToWatchlist(account);
        if (typeof onToggleWatchlist === 'function') onToggleWatchlist(true);
      }
    }
  };

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
        </Row>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {nameVisible && (
        <>
          <Spacer value={verticalScale(22)} />
          <Row alignItems="center">
            <Text fontFamily="Inter_600SemiBold" fontSize={15}>
              {account.name}
            </Text>
            {renderListAndWalletInfo()}
          </Row>
          <Spacer value={verticalScale(13)} />
        </>
      )}
      <Row alignItems="center">
        <CopyToClipboardButton
          textToDisplay={StringUtils.formatAddress(account.address, 11, 5)}
          textToCopy={account.address}
          textProps={{
            fontSize: 13,
            fontFamily: 'Inter_600SemiBold',
            color: COLORS.slateGrey
          }}
        />
        {!nameVisible && renderListAndWalletInfo()}
      </Row>
      <Spacer value={verticalScale(12)} />
      <Text
        fontFamily="Mersad_600SemiBold"
        fontSize={30}
        color={COLORS.jetBlack}
      >
        ${NumberUtils.formatNumber(USDBalance)}
      </Text>
      <Spacer value={verticalScale(16)} />
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        <Row alignItems="center">
          <Button
            style={{
              ...styles.actionButton,
              backgroundColor: account.isOnWatchlist
                ? COLORS.warning
                : COLORS.mainBlue
            }}
            type="circular"
            onPress={toggleWatchlist}
          >
            <Row alignItems="center">
              <Text
                fontSize={12}
                color={account.isOnWatchlist ? COLORS.liver : COLORS.white}
              >
                {account.isOnWatchlist ? 'WATCHLISTED' : 'ADD TO WATCHLIST'}
              </Text>
              {!account.isOnWatchlist && (
                <>
                  <Spacer value={scale(8)} horizontal />
                </>
              )}
            </Row>
          </Button>
          <Spacer value={scale(16)} horizontal />
          <Button
            style={{
              ...styles.actionButton,
              backgroundColor:
                listsWithAccount.length > 0
                  ? COLORS.warning
                  : COLORS.powderWhite
            }}
            type="circular"
            onPress={showAddToList}
          >
            <Row alignItems="center">
              <Text
                color={
                  listsWithAccount.length > 0
                    ? COLORS.liver
                    : COLORS.darkCornflowerBlue
                }
                fontSize={12}
              >
                {listsWithAccount.length === 0
                  ? 'ADD TO GROUP'
                  : listsWithAccount.length === 1
                  ? StringUtils.formatAddress(listsWithAccount[0].name, 16, 0)
                  : `Added to ${listsWithAccount.length} groups`}
              </Text>
              {listsWithAccount.length === 0 && (
                <>
                  <Spacer value={scale(8)} horizontal />
                </>
              )}
            </Row>
          </Button>
        </Row>
      </ScrollView>
      <BottomSheetWithHeader
        ref={addToListModal}
        height={fullscreenHeight * 0.95}
        title="Add address to group"
        avoidKeyboard={false}
        swiperIconVisible={true}
      >
        <AddWalletToList
          wallet={account}
          lists={listsOfAddressGroup}
          onWalletMove={hideAddToList}
        />
      </BottomSheetWithHeader>
    </View>
  );
};

export * from './ExplorerAccount.Transactions';
export * from './ExplorerAccount.TransactionItem';
