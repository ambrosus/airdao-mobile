import { RefObject } from 'react';
import { Image, ListRenderItemInfo, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgUri } from 'react-native-svg';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { DefaultPermissionsIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { removeConnectedAddressTo } from '@features/browser/lib';
import { WalletsPermissions } from '@features/browser/types';
import { scale, StringUtils } from '@utils';
import { Toast, ToastType } from '../Toast';
import { styles } from './styles';

interface PermissionItemModel {
  permissionItem: ListRenderItemInfo<WalletsPermissions>;
  updatePermissions: () => void;
  permissionsModalRef: RefObject<BottomSheetRef>;
}

export const PermissionItem = ({
  permissionItem,
  updatePermissions,
  permissionsModalRef
}: PermissionItemModel) => {
  const { t } = useTranslation();

  const { item } = permissionItem;
  const key = Object.keys(item)[0];
  const permission = item[key];

  const ProductImage = () => {
    if (permission?.icon) {
      return permission.icon.includes('.svg') ? (
        <SvgUri width="32" height="32" uri={permission?.icon} />
      ) : (
        <Image
          source={{ uri: permission?.icon }}
          style={styles.image}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <View style={styles.defaultIcon}>
          <DefaultPermissionsIcon />
        </View>
      );
    }
  };

  const onApprove = async () => {
    permissionsModalRef.current?.dismiss();
    removeConnectedAddressTo(key, permission.addresses[0]);
    updatePermissions();
    Toast.show({
      type: ToastType.Success,
      text: t('browser.remove.permission.toast.header')
    });
  };

  const onReject = () => permissionsModalRef?.current?.dismiss();

  const revokePermissions = async () => {
    permissionsModalRef?.current?.show({
      onApprove,
      onReject
    });
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <ProductImage />
        <Spacer horizontal value={scale(15)} />
        <View>
          <Text color={COLORS.neutral800} fontSize={scale(15)}>
            {StringUtils.formatUri({ uri: key })}
          </Text>
          {permission.addresses.map((item) => (
            <Text key={item}>{StringUtils.formatAddress(item, 6, 6)}</Text>
          ))}
        </View>
      </View>
      <Button style={styles.button} onPress={revokePermissions}>
        <Text color={COLORS.error500}>
          {t('wallet.connect.button.disconnect')}
        </Text>
      </Button>
    </View>
  );
};
