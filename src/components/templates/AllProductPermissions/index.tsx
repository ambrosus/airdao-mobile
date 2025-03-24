import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Spinner, Text } from '@components/base';
import { BottomSheetRef, PermissionItem } from '@components/composite';
import { COLORS } from '@constants/colors';
import { BottomSheetRemovePermissions } from '@features/browser/components/templates';
import { getAllWalletsPermissions, WalletsPermissions } from '@lib';
import { scale } from '@utils';
import { styles } from './styles';

export const AllProductPermissions = () => {
  const permissionsModalRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [connectedDetails, setConnectedDetails] = useState<
    WalletsPermissions[]
  >([]);
  const updatePermissions = async () => {
    try {
      setLoading(true);
      const allWalletsPermissions = await getAllWalletsPermissions();
      setConnectedDetails(allWalletsPermissions);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAll = async () => {
      await updatePermissions();
    };
    getAll().then();
  }, []);

  if (loading) {
    return <Spinner size="large" />;
  }

  if (!connectedDetails.length) {
    return (
      <View style={styles.noPermissionsContainer}>
        <Image
          style={styles.noPermissionsImage}
          source={require('@assets/images/no-nfts-thumb.png')}
        />
        <Spacer value={scale(10)} />
        <Text fontSize={scale(16)} color={COLORS.neutral800} align="center">
          {t('browser.remove.no.permissions.header')}
        </Text>
        <Spacer value={scale(5)} />
        <Text align="center">
          {t('browser.remove.no.permissions.subheader')}
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={connectedDetails}
        renderItem={(permissionItem) => (
          <PermissionItem
            permissionsModalRef={permissionsModalRef}
            updatePermissions={updatePermissions}
            permissionItem={permissionItem}
          />
        )}
      />
      <BottomSheetRemovePermissions ref={permissionsModalRef} />
    </>
  );
};
