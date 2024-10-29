import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { scale, verticalScale } from '@utils/scaling';
import { QRCodeWithLogo } from '@components/modular';
import { SettingsTabParamsList } from '@appTypes';
import { useExplorerAccountFromHash, useSettingsWalletActions } from '@hooks';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import { TrashIcon } from '@components/svg/icons';
import { KeyIcon } from '@components/svg/icons/v2/settings';
import { BottomSheetViewAccessKey } from '@components/templates/BottomSheetViewAccessKey/BottomSheetViewAccessKey';

export const SingleWalletScreen = () => {
  const accessKeyRef = useRef(null);
  const { t } = useTranslation();
  const route = useRoute<RouteProp<SettingsTabParamsList, 'SingleWallet'>>();
  const { wallet } = route.params;
  const { data: account } = useExplorerAccountFromHash(wallet.hash);
  const [walletName, setWalletName] = useState(wallet.name);
  const saveButtonEnabled = walletName !== wallet.name;
  useState(false);

  const { deleteWallet, saveChanges } = useSettingsWalletActions();

  const onSaveWalletChanges = () => saveChanges(wallet, walletName);

  const onToggleAccessKeysPress = () => {
    // @ts-ignore
    accessKeyRef?.current?.show();
  };

  const onRequestDeleteWalletPress = useCallback((): void => {
    Alert.alert(
      t('singleWallet.remove.alert.title'),
      t('singleWallet.remove.alert.description'),
      [
        {
          text: t('button.delete'),
          style: 'destructive',
          onPress: () => deleteWallet(account?.address, wallet.hash)
        },
        {
          text: t('button.cancel'),
          style: 'cancel'
        }
      ]
    );
  }, [account?.address, deleteWallet, t, wallet.hash]);

  const renderRightHeaderContent = useMemo(() => {
    return (
      <TouchableOpacity onPress={onRequestDeleteWalletPress} hitSlop={25}>
        <TrashIcon scale={1.2} color={COLORS.neutral400} />
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
                fontFamily="Inter_600SemiBold"
                fontSize={18}
                color={COLORS.neutral800}
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
                    <QRCodeWithLogo value={account.address} size={scale(200)} />
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
                    pressableText
                    showToast={false}
                    iconProps={{ scale: 1 }}
                    style={styles.copyButton}
                    textProps={{
                      color: COLORS.brand500,
                      fontSize: 14,
                      fontFamily: 'Inter_500Medium'
                    }}
                    successTextProps={{
                      color: COLORS.brand500,
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
                    : COLORS.brand100
                }}
              >
                <Text
                  fontSize={16}
                  fontFamily="Inter_600SemiBold"
                  color={saveButtonEnabled ? COLORS.neutral0 : COLORS.brand300}
                >
                  {t('singleWallet.save')}
                </Text>
              </Button>

              <TouchableOpacity
                onPress={onToggleAccessKeysPress}
                style={styles.accessKeysButton}
              >
                <KeyIcon color={COLORS.brand600} />
                <Spacer value={scale(10)} horizontal />
                <Text
                  fontSize={scale(16)}
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.brand600}
                >
                  {t('singleWallet.access.keys')}
                </Text>
              </TouchableOpacity>
            </View>
          </BottomAwareSafeAreaView>
        )}
      </SafeAreaView>
      <BottomSheetViewAccessKey
        // @ts-ignore
        dismiss={() => accessKeyRef?.current?.dismiss()}
        walletHash={wallet.hash}
        ref={accessKeyRef}
      />
    </>
  );
};
