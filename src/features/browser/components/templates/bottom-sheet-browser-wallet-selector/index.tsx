import { ForwardedRef, forwardRef, useCallback } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { WalletSelectorItem } from '@components/modular';
import { WalletDBModel } from '@database';
import { useForwardedRef } from '@hooks';
import { useAllAccounts, useAllWallets } from '@hooks/database';
import { styles } from './styles';

type Props = {
  onWalletSelect: (props: string) => void;
  selectedAddress: string;
};

export const BottomSheetBrowserWalletSelector = forwardRef<
  BottomSheetRef,
  Props
>(({ onWalletSelect, selectedAddress }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const allWalletsQueryInfo = useAllWallets();
  const allWallets = allWalletsQueryInfo.data;

  const { data: allAccounts } = useAllAccounts();

  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      if (allWalletsQueryInfo.refetch) allWalletsQueryInfo.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const renderWallet = (args: ListRenderItemInfo<WalletDBModel>) => {
    const account = allAccounts.find(
      // @ts-ignore
      (account) => account._raw?.hash === args.item.hash
    );

    const walletAddress = account?.address || '';

    return (
      <Button onPress={() => onWalletSelect(walletAddress)}>
        <WalletSelectorItem
          iconScale={1.1}
          walletAddress={walletAddress}
          index={args.index}
          wallet={args.item}
          isSelectedWallet={walletAddress === selectedAddress}
        />
      </Button>
    );
  };

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.main}
      swiperIconVisible
      title={t('browser.wallet.selector.header')}
      testID="BottomSheet_Remove_Address_From_Watchlists"
    >
      <View style={styles.listWrapper}>
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={allWallets}
          renderItem={renderWallet}
        />
      </View>
    </BottomSheet>
  );
});
