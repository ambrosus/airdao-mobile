import React, { useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { styles } from './ManageWallets.styles';
import { BottomSheetRef, Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AllWallets } from './components';
import { Button } from '@components/base';
import { AddIcon } from '@components/svg/icons';
import { BottomSheetWalletCreateOrImport } from '@components/templates';
import { scale } from '@utils';

export const ManageWalletsScreen = () => {
  const { t } = useTranslation();
  const walletImportCreate = useRef<BottomSheetRef>(null);

  const openWalletImportCreateModal = useCallback(() => {
    walletImportCreate.current?.show();
  }, []);
  const ImportWallet = () => (
    <>
      <Button
        style={{ marginRight: scale(5) }}
        onPress={() => openWalletImportCreateModal()}
        type="circular"
      >
        <AddIcon color={COLORS.neutral800} scale={1.25} />
      </Button>
      <BottomSheetWalletCreateOrImport ref={walletImportCreate} />
    </>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        titleStyle={styles.title}
        contentRight={<ImportWallet />}
        title={t('settings.manage.wallet')}
        style={{ shadowColor: COLORS.transparent }}
      />
      <AllWallets />
    </SafeAreaView>
  );
};
