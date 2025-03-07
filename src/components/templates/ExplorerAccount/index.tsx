import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Row, Spacer, Text } from '@components/base';
import { BottomSheetRef, CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { useListsSelector } from '@entities/lists';
import { useWatchlist } from '@hooks';
import { useAMBPrice } from '@hooks/query';
import { ExplorerAccount } from '@models/Explorer';
import { NumberUtils, scale, verticalScale, StringUtils } from '@utils';
import { styles } from './styles';
import { BottomSheetAddWalletToList } from '../BottomSheetAddWalletToList';

interface ExplorerAccountProps {
  setBottomStub?: (param: boolean) => void;
  account: ExplorerAccount;
  listInfoVisible?: boolean;
  nameVisible?: boolean;
  onToggleWatchlist?: (isOnWatchlist: boolean) => unknown;
}

export const ExplorerAccountView = ({
  account,
  listInfoVisible,
  nameVisible,
  onToggleWatchlist,
  setBottomStub = () => {
    // do nothing
  }
}: ExplorerAccountProps): JSX.Element => {
  const { t } = useTranslation();

  const { listsOfAddressGroup } = useListsSelector();
  const { addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { data: ambPriceData } = useAMBPrice();

  const ambPriceUSD = ambPriceData?.priceUSD || 0;

  const addToListModal = useRef<BottomSheetRef>(null);

  const AMBBalance = account.ambBalance;
  const USDBalance = AMBBalance * ambPriceUSD;
  const listsWithAccount = listsOfAddressGroup.filter(
    (list) => list.accounts.indexOfItem(account, 'address') > -1
  );
  const showName = nameVisible && account.name;

  const showAddToList = () => {
    addToListModal.current?.show();
    setTimeout(() => {
      setBottomStub(true);
    }, 450);
  };

  const hideAddToList = () => {
    setBottomStub(false);
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
      {showName && (
        <>
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
          // @ts-ignore
          textProps={styles.copyText}
          showToast={true}
          style={styles.copyTextContainer}
        />
        {!nameVisible && renderListAndWalletInfo()}
      </Row>
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center">
        <Text fontSize={28} fontWeight="700" color={COLORS.neutral900}>
          {NumberUtils.formatNumber(AMBBalance)}
        </Text>
        <Badge
          icon={
            <Text
              fontSize={14}
              fontWeight="500"
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
            >
              ${NumberUtils.formatNumber(USDBalance)}
            </Text>
          }
          color={COLORS.alphaBlack5}
        />
      </Row>
      {ambPriceData && (
        <>
          <Spacer value={verticalScale(16)} />
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            fontWeight="500"
            color={
              ambPriceData.percentChange24H > 0
                ? COLORS.success400
                : COLORS.error400
            }
          >
            {`${NumberUtils.addSignToNumber(
              ambPriceData.percentChange24H
            )}% ($${NumberUtils.formatNumber(
              (USDBalance * ambPriceData?.percentChange24H) / 100
            )}) 24${t('common.hour.short').toUpperCase()}`}
          </Text>
        </>
      )}
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
                ? COLORS.warning100
                : COLORS.brand600,
              borderWidth: account.isOnWatchlist ? 1 : 0,
              borderColor: account.isOnWatchlist
                ? COLORS.warning200
                : COLORS.transparent
            }}
            testID="Add_To_Watchlist_Button"
            type="circular"
            onPress={toggleWatchlist}
          >
            <Text
              fontSize={12}
              color={account.isOnWatchlist ? COLORS.liver : COLORS.neutral0}
            >
              {account.isOnWatchlist
                ? t('address.watchlisted')
                : t('address.add.watchlist')}
            </Text>
          </Button>
          <Spacer value={scale(16)} horizontal />
          <Button
            style={{
              ...styles.actionButton,
              backgroundColor:
                listsWithAccount.length > 0
                  ? COLORS.warning100
                  : COLORS.alphaBlack5,
              borderWidth: listsWithAccount.length > 0 ? 1 : 0,
              borderColor:
                listsWithAccount.length > 0
                  ? COLORS.warning200
                  : COLORS.transparent
            }}
            testID="Add_To_Collection_Button"
            type="circular"
            onPress={showAddToList}
          >
            <Text
              color={
                listsWithAccount.length > 0
                  ? COLORS.warning700
                  : COLORS.neutral900
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
          </Button>
        </Row>
      </ScrollView>

      <BottomSheetAddWalletToList
        onClose={() => setBottomStub(false)}
        ref={addToListModal}
        title={t('address.add.to.group')}
        wallet={account}
        lists={listsOfAddressGroup}
        onWalletMove={hideAddToList}
      />
    </View>
  );
};

export * from './ExplorerAccount.Transactions';
export * from './components/transaction-item/ExplorerAccount.TransactionItem';
