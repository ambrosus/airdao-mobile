import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsTabParamsList } from '@appTypes';
import { Button, Input, Spacer, Text } from '@components/base';
import {
  BottomAwareSafeAreaView,
  CopyToClipboardButton,
  Header
} from '@components/composite';
import { QRCodeWithLogo } from '@components/modular';
import { TrashIcon } from '@components/svg/icons';
import { KeyIcon } from '@components/svg/icons/v2/settings';
import { BottomSheetViewAccessKey } from '@components/templates/BottomSheetViewAccessKey/BottomSheetViewAccessKey';
import { COLORS } from '@constants/colors';
import { useExplorerAccountFromHash, useSettingsWalletActions } from '@hooks';
import { scale, verticalScale } from '@utils';
import { styles } from './styles';

type Props = NativeStackScreenProps<SettingsTabParamsList, 'SingleWallet'>;

export const SingleWalletScreen = ({ route }: Props) => {
  const { t } = useTranslation();

  const accessKeyRef = useRef(null);
  const { wallet, walletAddress } = route.params;
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
          onPress: () => deleteWallet(walletAddress, wallet.hash)
        },
        {
          text: t('button.cancel'),
          style: 'cancel'
        }
      ]
    );
  }, [walletAddress, deleteWallet, t, wallet.hash]);

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
            <Text
              numberOfLines={1}
              fontFamily="Inter_600SemiBold"
              fontSize={18}
              color={COLORS.neutral800}
            >
              {wallet?.name || 'Wallet'}
            </Text>
          }
          contentRight={renderRightHeaderContent}
          style={{ shadowColor: COLORS.transparent }}
        />
        {wallet && (
          <BottomAwareSafeAreaView style={styles.innerContainer}>
            <View style={{ paddingHorizontal: '5%' }}>
              <View>
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
              {account && (
                <View style={styles.addressContainer}>
                  <View style={styles.qrCode}>
                    <QRCodeWithLogo value={walletAddress} size={scale(200)} />
                  </View>
                  <Spacer value={verticalScale(16)} />
                  <Text
                    align="center"
                    fontSize={18}
                    color={COLORS.neutral800}
                    fontFamily="Inter_500Medium"
                  >
                    {walletAddress}
                  </Text>
                  <View style={styles.copyAddressButtonWrapper}>
                    <CopyToClipboardButton
                      textToDisplay={t('common.copy')}
                      textToCopy={walletAddress}
                      pressableText
                      showToast={false}
                      iconProps={{ scale: 1 }}
                      containerStyle={styles.copyButton}
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
