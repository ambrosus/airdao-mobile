import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { API } from '@api/api';
import { WalletStackParamsList } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { BlocksoftTransfer } from '@crypto/actions/BlocksoftTransfer/BlocksoftTransfer';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { WalletDBModel } from '@database';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';
import { Wallet } from '@models/Wallet';
import { RouteProp, useRoute } from '@react-navigation/native';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { ExplorerAccount } from '@models';
import { COLORS } from '@constants/colors';

export const ReceiptScreen = () => {
  const route = useRoute<RouteProp<WalletStackParamsList, 'ReceiptScreen'>>();
  const { amount, currencyCode, hash, destination, origin } = route.params;
  const [sending, setSending] = useState(false);
  const wallet = useRef<Wallet | null>(null);
  const account = useRef<ExplorerAccount>();

  const init = async () => {
    const _walletInDB = await WalletDBModel.getByHash(hash);
    if (!_walletInDB) {
      console.log(!_walletInDB, 'there is no wallet in the DB');
      return;
    }
    wallet.current = Wallet.fromDBModel(_walletInDB);
    const _account = await API.explorerService.searchAddress(origin);
    if (!_account) {
      console.log(!_account, '!_account');
      return;
    }
    account.current = new ExplorerAccount(_account);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendCrypto = async () => {
    console.log({ wallet: wallet.current, account: account.current });
    if (!wallet.current || !account.current) return;
    try {
      setSending(true);
      //   const walletInDB = await WalletDBModel.getByHash(hash);
      //   console.log({ walletInDB });
      //   if (!walletInDB) return;
      //   const wallet = Wallet.fromDBModel(walletInDB);
      //   const account = await API.explorerService.searchAddress(origin);
      const info = await AirDAOKeysForRef.discoverPublicAndPrivate({
        mnemonic: wallet.current.mnemonic
      });
      await BlocksoftTransfer.sendTx(
        {
          currencyCode: AirDAODictTypes.Code.ETH,
          walletHash: hash,
          derivationPath: info.path,
          addressFrom: origin,
          addressTo: destination,
          amount: amount.toString(),
          useOnlyConfirmed: Boolean(wallet.current.useUnconfirmed),
          allowReplaceByFee: Boolean(wallet.current.allowReplaceByFee),
          useLegacy: wallet.current.useLegacy,
          isHd: Boolean(wallet.current.isHd),
          accountBalanceRaw: account.current.ambBalance.toString(),
          isTransferAll: false
        },
        {
          uiErrorConfirmed: true,
          selectedFee: {
            langMsg: '',
            feeForTx: '',
            amountForTx: ''
          }
        }, // TODO fix selected fee
        // CACHE_DATA.additionalData
        {}
      );
    } catch (error) {
      console.log({ error }, 'there was an error sending tx');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView>
      <Header title="Receipt" style={{ shadowColor: 'transparent' }} />
      <View
        style={{ paddingHorizontal: scale(16), marginTop: verticalScale(24) }}
      >
        <Row justifyContent="space-between">
          <Text>Amount:</Text>
          <Text>
            {amount} {currencyCode}
          </Text>
        </Row>
        <Row justifyContent="space-between">
          <Text>Destination:</Text>
          <Text>{StringUtils.formatAddress(destination, 9, 6)}</Text>
        </Row>
        <Spacer value={verticalScale(24)} />
        <PrimaryButton onPress={sendCrypto}>
          <Text
            align="center"
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.white}
          >
            Send
          </Text>
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
};
