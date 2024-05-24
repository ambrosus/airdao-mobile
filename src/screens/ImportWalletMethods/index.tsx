import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Header } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import {
  ChevronDownIcon,
  KeyIcon,
  ReadingListIcon
} from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { HomeParamsList } from '@appTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type MethodListItemType = (typeof ADD_WALLET_METHODS)[number];
type ImportWalletMethodsProps = NativeStackScreenProps<
  HomeParamsList,
  'ImportWalletMethods'
>;

const ADD_WALLET_METHODS = [
  {
    label: 'Import with recovery phrase',
    icon: <ReadingListIcon />,
    method: 'mnemonic'
  },
  {
    label: 'Import with private keys',
    icon: <KeyIcon />,
    method: 'key'
  }
] as const;

export const ImportWalletMethods = ({
  navigation
}: ImportWalletMethodsProps) => {
  const renderAddWalletMethodListItem = useCallback(
    (args: ListRenderItemInfo<MethodListItemType>) => {
      const onNavigateToImportScreen = () => {
        const viaMnemonic = args.item.method === 'mnemonic';
        navigation.navigate(
          viaMnemonic ? 'ImportWallet' : 'ImportWalletPrivateKey'
        );
      };

      return (
        <Button onPress={onNavigateToImportScreen}>
          <Row
            alignItems="center"
            justifyContent="space-between"
            style={styles.addWalletMethodListItem}
          >
            <Row alignItems="center" style={styles.addWalletMethodListItemGap}>
              {args.item.icon}
              <Text
                fontSize={16}
                fontFamily="Inter_600SemiBold"
                color={COLORS.neutral800}
              >
                {args.item.label}
              </Text>
            </Row>
            <ChevronDownIcon rotate="270deg" color={COLORS.neutral400} />
          </Row>
        </Button>
      );
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder title="Import wallet" />
      <Spacer value={scale(16)} />
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
