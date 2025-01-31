import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@components/base';
import { BottomSheetRef, Header } from '@components/composite';
import { AddIcon } from '@components/svg/icons';
import { BottomSheetWalletCreateOrImport } from '@components/templates';
import { COLORS } from '@constants/colors';
import { AllWallet } from './components';
import { styles } from './ManageWallets.styles';

export const ManageWalletsScreen = () => {
  const { t } = useTranslation();
  const walletImportCreate = useRef<BottomSheetRef>(null);

  const openWalletImportCreateModal = useCallback(() => {
    walletImportCreate.current?.show();
  }, []);
  const ImportWallet = () => (
    <>
      <Button
        style={styles.importButton}
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
      <AllWallet />
    </SafeAreaView>
  );
};
