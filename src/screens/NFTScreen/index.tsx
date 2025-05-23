import { Image, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeParamsList } from '@appTypes';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { Header } from '@components/composite';
import NFTPlaceholder from '@components/svg/icons/NFTPlaceholder';
import { COLORS } from '@constants/colors';
import { useNFTInfo } from '@hooks/query/useNFTInfo';
import { styles } from './styles';

export const NFTScreen = () => {
  const {
    params: { tokenInfo, walletAccount }
  } = useRoute<RouteProp<HomeParamsList, 'NFTScreen'>>();
  const { top } = useSafeAreaInsets();
  const { data, loading } = useNFTInfo(walletAccount);
  const error = !data?.tokenUri;
  const { t } = useTranslation();
  const NFTContent = () =>
    error ? (
      <View
        style={{
          ...styles.centerAlign,
          ...styles.errorContainer
        }}
      >
        <NFTPlaceholder />
        <Spacer value={24} />
        <Text fontSize={20} color={COLORS.neutral900} fontWeight={'600'}>
          {t('wallet.empty.nft.header')}
        </Text>
        <Spacer value={10} />
        <Text align={'center'} fontSize={16} color={COLORS.neutral600}>
          {t('wallet.empty.nft.subheader')}
        </Text>
      </View>
    ) : (
      <View style={styles.NFTContainer}>
        <Image
          source={{ uri: `${data?.tokenUri}` }}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
    );

  const Content = () => {
    return loading ? (
      <View style={styles.centerAlign}>
        <Spinner size={'large'} />
      </View>
    ) : (
      <NFTContent />
    );
  };

  return (
    <View style={{ top, flex: 1 }}>
      <Header
        title={
          <Row alignItems="center">
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={18}
              color={COLORS.neutral800}
            >
              {tokenInfo.name}
            </Text>
          </Row>
        }
      />
      <View style={styles.headerBorder} />
      <Spacer value={21} />
      <Content />
    </View>
  );
};
