import React, { useCallback, useMemo, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
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
import { SettingsTabParamsList } from '@appTypes';
import { useExplorerAccountFromHash, useSettingsWalletActions } from '@hooks';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import { TrashIcon } from '@components/svg/icons';
import { AccessKeysWarningModal } from '@components/templates';

export const SingleWalletScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<SettingsTabParamsList, 'SingleWallet'>>();
  const { wallet } = route.params;
  const { data: account } = useExplorerAccountFromHash(wallet.hash);
  const [walletName, setWalletName] = useState(wallet.name);
  const saveButtonEnabled = walletName !== wallet.name;
  const [isAccessKeyWarningModalActive, setIsAccessKeyWarningModalActive] =
    useState(false);

  const { deleteWallet, saveChanges } = useSettingsWalletActions();

  const onSaveWalletChanges = () => saveChanges(wallet, walletName);

  const onToggleAccessKeysPress = () => {
    setIsAccessKeyWarningModalActive((prevState) => !prevState);
  };

  const onRequestDeleteWalletPress = useCallback((): void => {
    Alert.alert(
      t('singleWallet.remove.alert.title'),
      t('singleWallet.remove.alert.description'),
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWallet(account?.address, wallet.hash)
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  }, [account?.address, deleteWallet, t, wallet.hash]);

  const renderRightHeaderContent = useMemo(() => {
    return (
      <TouchableOpacity onPress={onRequestDeleteWalletPress} hitSlop={25}>
        <TrashIcon color={COLORS.neutral400} />
      </TouchableOpacity>
    );
  }, [onRequestDeleteWalletPress]);

  return (
    <>
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
          contentRight={renderRightHeaderContent}
          style={{ shadowColor: COLORS.transparent }}
        />
        {wallet && (
          <BottomAwareSafeAreaView style={styles.innerContainer}>
            <View>
              <View style={styles.nameInput}>
                <Text
                  fontSize={16}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral900}
                >
                  {t('singleWallet.name')}
                </Text>
                <Spacer value={verticalScale(8)} />
                <Input
                  value={walletName}
                  onChangeValue={setWalletName}
                  style={styles.input}
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

            <View style={styles.footer}>
              <Button
                onPress={onSaveWalletChanges}
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
                  color={
                    saveButtonEnabled ? COLORS.neutral0 : COLORS.alphaBlack30
                  }
                >
                  {t('singleWallet.save')}
                </Text>
              </Button>

              <Button
                onPress={onToggleAccessKeysPress}
                style={styles.accessKeysButton}
              >
                <Text
                  fontSize={16}
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.neutral800}
                >
                  {t('singleWallet.access.keys')}
                </Text>
              </Button>
            </View>
          </BottomAwareSafeAreaView>
        )}
      </SafeAreaView>
      {isAccessKeyWarningModalActive && (
        <AccessKeysWarningModal
          dismiss={onToggleAccessKeysPress}
          walletHash={wallet.hash}
        />
      )}
    </>
  );
};
