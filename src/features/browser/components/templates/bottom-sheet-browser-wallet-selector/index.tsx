import { ForwardedRef, forwardRef, useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@components/base';
import {
  BottomSheet,
  BottomSheetOutsideDataProps,
  BottomSheetRef
} from '@components/composite';
import { COLORS } from '@constants/colors';
import { WalletDBModel } from '@database';
import { BrowserWalletItem } from '@features/browser/components/templates/bottom-sheet-browser-wallet-selector/components';
import { useForwardedRef } from '@hooks';
import { useAllAccounts, useAllWallets } from '@hooks/database';
import { scale } from '@utils';
import { styles } from './styles';

type Props = {
  selectedAddress: string;
  uri: string;
};

export const BottomSheetBrowserWalletSelector = forwardRef<
  BottomSheetRef,
  Props
>(({ selectedAddress, uri }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const allWalletsQueryInfo = useAllWallets();
  const [outsideModalData, setOutsideModalData] = useState(
    {} as BottomSheetOutsideDataProps
  );

  const { data: allWallets } = allWalletsQueryInfo;
  const { data: allAccounts } = useAllAccounts();

  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      if (allWalletsQueryInfo.refetch) allWalletsQueryInfo.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const renderWallet = (args: ListRenderItemInfo<WalletDBModel>) => {
    const walletAddress = allAccounts[args.index].address;
    return (
      <Button
        onPress={() => {
          if (outsideModalData?.onWalletSelect) {
            outsideModalData?.onWalletSelect(walletAddress);
          }
        }}
      >
        <BrowserWalletItem
          walletAddress={walletAddress}
          itemIndex={args.index}
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
      title={uri}
      setOutsideModalData={setOutsideModalData}
      testID="BottomSheet_Remove_Address_From_Watchlists"
    >
      <View style={styles.text}>
        <Text fontSize={scale(15)} color={COLORS.neutral900}>
          {t('browser.wallet.selector.header')}
        </Text>
      </View>
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
