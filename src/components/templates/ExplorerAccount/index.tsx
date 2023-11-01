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
// import { PlusIcon } from '@components/svg/icons';
import { BottomSheetRef, CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AddWalletToList } from '../AddWalletToList';
import { BottomSheetWithHeader } from '@components/modular';
import { useFullscreenModalHeight } from '@hooks/useFullscreenModalHeight';
import { useWatchlist } from '@hooks';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
                {t('address.added.to.group')}
                {listsWithAccount[0].name}
              </Text>
            ) : (
              <Text
                color="#828282"
                fontFamily="Inter_400Regular"
                fontSize={13}
                fontWeight="400"
              >
                {t('address.added.to.group', {
                  count: listsWithAccount.length
                })}
              </Text>
            ))}
        </Row>
      </>
    );
  };

  return (
    <View style={styles.container} testID="Explorer_Account_View">
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
          testID="Copy_To_Clipboard_Button"
          textToDisplay={StringUtils.formatAddress(account.address, 11, 5)}
          textToCopy={account.address}
          textProps={{
            fontSize: 14,
            fontFamily: 'Inter_600SemiBold',
            color: COLORS.neutral400
          }}
          showToast={true}
          style={{ padding: 4 }}
        />
        {!nameVisible && renderListAndWalletInfo()}
      </Row>
      <Spacer value={verticalScale(12)} />
      <Text
        fontFamily="Mersad_600SemiBold"
        fontSize={30}
        color={COLORS.neutral800}
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
                ? COLORS.warning200
                : COLORS.brand600
            }}
            testID="Add_To_Watchlist_Button"
            type="circular"
            onPress={toggleWatchlist}
          >
            <Row alignItems="center">
              <Text
                fontSize={12}
                color={account.isOnWatchlist ? COLORS.liver : COLORS.neutral0}
              >
                {account.isOnWatchlist
                  ? t('address.watchlisted')
                  : t('address.add.watchlist')}
              </Text>
              {/*{!account.isOnWatchlist && (*/}
              {/*  <>*/}
              {/*    <Spacer value={scale(8)} horizontal />*/}
              {/*    <PlusIcon color={COLORS.neutral0} scale={0.5} />*/}
              {/*  </>*/}
              {/*)}*/}
            </Row>
          </Button>
          <Spacer value={scale(16)} horizontal />
          <Button
            style={{
              ...styles.actionButton,
              backgroundColor:
                listsWithAccount.length > 0
                  ? COLORS.warning200
                  : COLORS.brand100
            }}
            testID="Add_To_Collection_Button"
            type="circular"
            onPress={showAddToList}
          >
            <Row alignItems="center">
              <Text
                color={
                  listsWithAccount.length > 0 ? COLORS.liver : COLORS.brand700
                }
                fontSize={12}
              >
                {listsWithAccount.length === 0
                  ? t('address.add.group')
                  : listsWithAccount.length === 1
                  ? StringUtils.formatAddress(listsWithAccount[0].name, 16, 0)
                  : t('address.added.to.group', {
                      count: listsWithAccount.length
                    })}
              </Text>
              {/*{listsWithAccount.length === 0 && (*/}
              {/*  <>*/}
              {/*    <Spacer value={scale(8)} horizontal />*/}
              {/*    <PlusIcon color={COLORS.brand700} scale={0.5} />*/}
              {/*  </>*/}
              {/*)}*/}
            </Row>
          </Button>
        </Row>
      </ScrollView>
      <BottomSheetWithHeader
        ref={addToListModal}
        height={fullscreenHeight * 0.95}
        title={t('address.add.to.group')}
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
