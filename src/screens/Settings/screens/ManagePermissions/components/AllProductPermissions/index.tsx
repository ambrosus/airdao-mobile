import { useEffect, useState } from 'react';
import { FlatList, View, ListRenderItemInfo, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgUri } from 'react-native-svg';
import { Button, Spacer, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  getWalletsPermissions,
  GroupedPermissions,
  WalletConnectionDetails
} from '@lib';
import { scale, StringUtils } from '@utils';

type PermissionData = {
  [uri: string]: {
    title: string;
    productIcon: string;
    address: string[];
    timestamp: number;
  };
};

export const AllProductPermissions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [connectedDetails, setConnectedDetails] = useState<
    GroupedPermissions[]
  >([]);
  const { t } = useTranslation();
  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        const walletsPermissions: WalletConnectionDetails[] =
          await getWalletsPermissions();
        const groupedPermissions: PermissionData = {};

        walletsPermissions.forEach(({ address, data }) => {
          data.forEach(({ uri, productIcon, timestamp, title }) => {
            if (!groupedPermissions[uri]) {
              groupedPermissions[uri] = {
                title,
                productIcon,
                address: [],
                timestamp
              };
            }
            groupedPermissions[uri].address.push(address);
          });
        });
        const _connectedDetails = Object.entries(groupedPermissions).map(
          ([uri, data]) => ({ uri, data })
        );
        setConnectedDetails(_connectedDetails);
      } finally {
        setLoading(false);
      }
    };
    getDetails().then();
  }, []);

  const renderItem = (arg: ListRenderItemInfo<GroupedPermissions>) => {
    const { item } = arg;
    const { uri, data } = item;
    const { address, productIcon, timestamp } = data;
    const ProductImage = () =>
      productIcon.includes('.svg') ? (
        <SvgUri width="32" height="32" uri={productIcon} />
      ) : (
        <Image
          source={{ uri: productIcon }}
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
      );

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.neutral100,
          borderRadius: 12,
          padding: scale(15),
          justifyContent: 'space-between',
          marginBottom: scale(10)
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <ProductImage />
          <Spacer horizontal value={scale(15)} />
          <View>
            <Text color={COLORS.neutral800} fontSize={scale(15)}>
              {StringUtils.formatUri({ uri })}
            </Text>
            {address.map((item) => (
              <Text key={timestamp}>
                {StringUtils.formatAddress(item, 6, 6)}
              </Text>
            ))}
          </View>
        </View>
        <Button
          style={{
            paddingVertical: scale(10)
          }}
          onPress={() => {}}
        >
          <Text color={COLORS.error500}>
            {t('wallet.connect.button.disconnect')}
          </Text>
        </Button>
      </View>
    );
  };

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <View style={{}}>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: scale(10),
          paddingTop: scale(10)
        }}
        data={connectedDetails}
        renderItem={renderItem}
      />
    </View>
  );
};
