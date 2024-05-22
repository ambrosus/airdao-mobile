import React, { useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  BottomAwareSafeAreaView,
  BottomSheetRef,
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
import { styles } from './styles';
import { MoreDotsIcon } from '@components/svg/icons';
import { BottomSheetSettingsActions } from '@components/templates/BottomSheetSettingsActions';

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

  const bottomSheetActionRef = useRef<BottomSheetRef>(null);
  const onActionsHeaderPress = () => {
    bottomSheetActionRef.current?.show();
  };

  const renderRightHeaderContent = useMemo(() => {
    return (
      <TouchableOpacity onPress={onActionsHeaderPress} hitSlop={25}>
        <MoreDotsIcon />
      </TouchableOpacity>
    );
  }, []);

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
        contentRight={renderRightHeaderContent}
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
          <BottomSheetSettingsActions
            wallet={wallet}
            account={account}
            ref={bottomSheetActionRef}
          />
        </BottomAwareSafeAreaView>
      )}
    </SafeAreaView>
  );
};
