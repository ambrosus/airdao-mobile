import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AllProductPermissions } from '@screens/Settings/screens/ManagePermissions/components';
import { styles } from './styles';

export const ManagePermissions = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        titleStyle={styles.title}
        title={t('settings.manage.permissions')}
        style={{ shadowColor: COLORS.transparent }}
      />
      <AllProductPermissions />
    </SafeAreaView>
  );
};
