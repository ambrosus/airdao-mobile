import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Header } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { HomeParamsList } from '@appTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Edit, Key } from '@components/svg/icons/v2';
import { useRoute } from '@react-navigation/native';

type ImportWalletMethod = {
  label: string;
  info: string;
  icon: JSX.Element;
  method: 'mnemonic' | 'key';
};

type ImportWalletMethodsProps = NativeStackScreenProps<
  HomeParamsList,
  'ImportWalletMethods'
>;

export const ImportWalletMethods = ({
  navigation
}: ImportWalletMethodsProps) => {
  const { t } = useTranslation();
  const { params } = useRoute();

  const onBackPress = () => {
    if (params?.from === 'WelcomeScreen') {
      navigation.navigate('WelcomeScreen');
    } else {
      navigation.goBack();
    }
  };
  const ADD_WALLET_METHODS: ImportWalletMethod[] = [
    {
      label: t('import.wallet.methods.mnemonic'),
      info: t('import.wallet.methods.mnemonic.info'),
      icon: <Edit color={COLORS.brand500} />,
      method: 'mnemonic'
    },
    {
      label: t('import.wallet.methods.key'),
      info: t('import.wallet.methods.key.info'),
      icon: <Key color={COLORS.brand500} />,
      method: 'key'
    }
  ] as const;
  const renderAddWalletMethodListItem = useCallback(
    (args: ListRenderItemInfo<ImportWalletMethod>) => {
      const onNavigateToImportScreen = () => {
        const viaMnemonic = args.item.method === 'mnemonic';
        navigation.navigate(
          viaMnemonic ? 'ImportWallet' : 'ImportWalletPrivateKey'
        );
      };

      return (
        <Button style={styles.main} onPress={onNavigateToImportScreen}>
          <Row
            alignItems="center"
            justifyContent="space-between"
            style={styles.addWalletMethodListItem}
          >
            <Row alignItems="center" style={styles.addWalletMethodListItemGap}>
              {args.item.icon}
              <Spacer horizontal value={scale(3)} />
              <View>
                <Text
                  fontSize={16}
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.neutral800}
                >
                  {args.item.label}
                </Text>
                <Spacer value={scale(6)} />
                <Text fontSize={13} fontFamily="Inter_600SemiBold">
                  {args.item.info}
                </Text>
              </View>
            </Row>
          </Row>
        </Button>
      );
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBackPress={onBackPress}
        bottomBorder
        title={t('import.wallet.common.title')}
      />
      <Spacer value={scale(17)} />
      <Text
        fontFamily={'Inter_400Regular'}
        fontSize={scale(16)}
        color={COLORS.neutral900}
        align="center"
      >
        {t('import.wallet.subtitle')}
      </Text>
      <Spacer value={scale(17)} />
      <FlatList
        bounces={false}
        scrollEnabled={false}
        data={ADD_WALLET_METHODS}
        renderItem={renderAddWalletMethodListItem}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </SafeAreaView>
  );
};
