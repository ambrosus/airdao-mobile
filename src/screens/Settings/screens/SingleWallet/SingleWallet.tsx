import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  BottomAwareSafeAreaView,
  CopyToClipboardButton,
  Header
} from '@components/composite';
import { Button, Input, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { QRCodeWithLogo } from '@components/modular';
import {
  DatabaseTable,
  SettingsTabNavigationProp,
  SettingsTabParamsList
} from '@appTypes';
import { useExplorerAccountFromHash } from '@hooks';
import { COLORS } from '@constants/colors';
import { Database, WalletDBModel } from '@database';
import { WalletUtils } from '@utils/wallet';
import { API } from '@api/api';
import { styles } from './styles';

export const SingleWalletScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<SettingsTabParamsList, 'SingleWallet'>>();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const { wallet } = route.params;
  const { data: account } = useExplorerAccountFromHash(wallet.hash);
  const [walletName, setWalletName] = useState(wallet.name);
  const saveButtonEnabled = walletName !== wallet.name;

  const saveChanges = async () => {
    await Database.updateModel(DatabaseTable.Wallets, wallet.id, {
      name: walletName
    });
    (wallet._raw as unknown as WalletDBModel).name = walletName;
    //@ts-ignore
    navigation.setParams({
      wallet: wallet
    });
  };
  const deleteWallet = async () => {
    await WalletUtils.deleteWalletWithAccounts(wallet.hash);
    if (account?.address) {
      API.watcherService.removeWatcherForAddresses([account.address]);
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AppInit' }]
      })
    );
  };

  const promptWalletDeletion = () => {
    Alert.alert(
      t('singleWallet.remove.alert.title'),
      t('singleWallet.remove.alert.description'),
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteWallet
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        title={
          <View style={{ paddingHorizontal: '20%' }}>
            <Text
              numberOfLines={1}
              fontFamily="Inter_700Bold"
              fontSize={16}
              color={COLORS.neutral900}
            >
              {wallet?.name || 'Wallet'}
            </Text>
          </View>
        }
        contentRight={
          <Button onPress={promptWalletDeletion}>
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.error400}
            >
              {t('singleWallet.remove')}
            </Text>
          </Button>
        }
        style={{ shadowColor: COLORS.transparent }}
      />
      {wallet && (
        <BottomAwareSafeAreaView style={styles.innerContainer}>
          <View>
            <View style={styles.nameInput}>
              <Text>{t('singleWallet.name')}</Text>
              <Spacer value={verticalScale(8)} />
              <Input
                value={walletName}
                onChangeValue={setWalletName}
                style={{
                  shadowColor: COLORS.transparent,
                  borderWidth: 1,
                  borderColor: COLORS.alphaBlack10
                }}
              />
            </View>
            <Spacer value={verticalScale(42)} />
            {account && (
              <View style={styles.addressContainer}>
                <View style={styles.qrCode}>
                  <QRCodeWithLogo
                    value={account.address}
                    size={verticalScale(200)}
                  />
                </View>
                <Spacer value={verticalScale(16)} />
                <Text
                  align="center"
                  fontSize={18}
                  color={COLORS.neutral800}
                  fontFamily="Inter_500Medium"
                >
                  {account.address}
                </Text>
                <Spacer value={verticalScale(16)} />
                <CopyToClipboardButton
                  textToDisplay={t('common.copy')}
                  textToCopy={account.address}
                  pressableText={true}
                  showToast={false}
                  iconProps={{ scale: 0 }}
                  style={styles.copyButton}
                  textProps={{
                    color: COLORS.neutral900,
                    fontSize: 14,
                    fontFamily: 'Inter_500Medium'
                  }}
                  successTextProps={{
                    color: COLORS.success600,
                    fontSize: 14,
                    fontFamily: 'Inter_500Medium'
                  }}
                />
              </View>
            )}
          </View>
          <Button
            onPress={saveChanges}
            disabled={!saveButtonEnabled}
            style={{
              ...styles.saveButton,
              backgroundColor: saveButtonEnabled
                ? COLORS.brand600
                : COLORS.alphaBlack5
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={saveButtonEnabled ? COLORS.neutral0 : COLORS.alphaBlack30}
            >
              {t('singleWallet.save')}
            </Text>
          </Button>
        </BottomAwareSafeAreaView>
      )}
    </SafeAreaView>
  );
};
