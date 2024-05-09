import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { HistoryIcon } from '@components/svg/icons';
import { HomeNavigationProp } from '@appTypes';
import { BridgeTemplate } from '@/components/templates/Bridge';
import { Spacer } from '@components/base';
import { scale } from '@utils/scaling';

export const Bridge = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  const onNavigateToHistory = () => navigation.navigate('BridgeHistory');

  const renderHeaderRightContent = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={onNavigateToHistory}
        hitSlop={15}
        style={styles.headerHistoryIcon}
      >
        <HistoryIcon />
      </TouchableOpacity>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Bridge"
        bottomBorder
        contentRight={renderHeaderRightContent}
      />
      <Spacer value={scale(15)} />
      <BridgeTemplate />
    </SafeAreaView>
  );
};
