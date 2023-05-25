import React, { useRef } from 'react';
import { View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { ExplorerAccount } from '@models/Explorer';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks/query';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { useLists } from '@contexts/ListsContext';
import { PlusIcon } from '@components/svg/icons';
import { BottomSheetRef, CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AddWalletToList } from '../AddWalletToList';
import { BottomSheetWithHeader } from '@components/modular';
import { useFullscreenModalHeight } from '@hooks/useFullscreenModalHeight';

interface ExplorerAccountProps {
  account: ExplorerAccount;
  listInfoVisible?: boolean;
  nameVisible?: boolean;
  onToggleWatchlist: () => unknown;
}

export const ExplorerAccountView = (
  props: ExplorerAccountProps
): JSX.Element => {
  const { account, listInfoVisible, nameVisible, onToggleWatchlist } = props;
  const { listsOfAddressGroup } = useLists((v) => v);
  const fullscreenHeight = useFullscreenModalHeight();

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
    addToListModal.current?.dismiss();
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
      <Row alignItems="center">
        <Button
          style={{
            ...styles.actionButton,
            backgroundColor: account.isOnWatchlist
              ? COLORS.warning
              : COLORS.mainBlue
          }}
          type="circular"
          onPress={onToggleWatchlist}
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
                <Spacer value={scale(7)} horizontal />
                <PlusIcon color={COLORS.white} scale={0.5} />
              </>
            )}
          </Row>
        </Button>
        <Spacer value={scale(16)} horizontal />
        <Button
          style={{
            ...styles.actionButton,
            backgroundColor:
              listsWithAccount.length > 0 ? COLORS.warning : COLORS.powderWhite
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
                ? 'ADD TO COLLECTION'
                : listsWithAccount.length === 1
                ? listsWithAccount[0].name
                : `Added to ${listsWithAccount.length} collections`}
            </Text>
            {listsWithAccount.length === 0 && (
              <>
                <Spacer value={scale(7)} horizontal />
                <PlusIcon color={COLORS.darkCornflowerBlue} scale={0.5} />
              </>
            )}
          </Row>
        </Button>
      </Row>
      <BottomSheetWithHeader
        ref={addToListModal}
        height={fullscreenHeight * 0.95}
        title="Add address to collection"
        avoidKeyboard={false}
        swiperIconVisible={true}
      >
        <AddWalletToList
          wallet={account}
          lists={listsOfAddressGroup}
          onWalletToggled={hideAddToList}
        />
      </BottomSheetWithHeader>
    </View>
  );
};

export * from './ExplorerAccount.Transactions';
export * from './ExplorerAccount.TransactionItem';
