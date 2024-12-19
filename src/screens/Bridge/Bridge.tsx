import React, { useCallback, useEffect, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CopyToClipboardButton, Header } from '@components/composite';
import { HistoryIcon } from '@components/svg/icons';
import { HomeNavigationProp } from '@appTypes';
import { Spacer, Spinner } from '@components/base';
import { useBridgeContextData } from '@features/bridge/context';
import { BridgeTemplate } from '@features/bridge/templates';
import { usePendingTransactions } from '@features/bridge/hooks/usePendingTransactions';
import { StringUtils, scale } from '@utils';
import { useWalletStore } from '@entities/wallet';

export const Bridge = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  const { wallet } = useWalletStore();

  const onNavigateToHistory = () => navigation.navigate('BridgeHistory');
  const { methods, variables } = useBridgeContextData();
  const { loadAllBridgeData, setAmountToBridge } = methods;
  const { bridgeLoader } = variables;
  const { isPendingTransactions } = usePendingTransactions();

  const renderHeaderRightContent = useMemo(() => {
    return (
      <TouchableOpacity onPress={onNavigateToHistory} hitSlop={15}>
        <HistoryIcon notification={isPendingTransactions} />
      </TouchableOpacity>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAllBridgeData().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setAmountToBridge('');
      };
    }, [setAmountToBridge])
  );

  if (bridgeLoader) {
    return (
      <SafeAreaView style={styles.loader}>
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBackPress={navigation.goBack}
        title="Bridge"
        bottomBorder
        contentRight={renderHeaderRightContent}
      />
      <CopyToClipboardButton
        textToDisplay={StringUtils.formatAddress(wallet?.address ?? '', 5, 6)}
        textToCopy={wallet?.address}
      />
      <Spacer value={scale(15)} />
      <BridgeTemplate />
    </SafeAreaView>
  );
};
