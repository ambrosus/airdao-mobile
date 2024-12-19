import React, { useCallback, useEffect, useRef } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Button } from '@components/base';
import { Header } from '@components/composite';
import { NoteIcon } from '@components/svg/icons/v2/harbor';
import { DEVICE_HEIGHT } from '@constants/variables';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { useEffectOnce, useKeyboardHeight } from '@hooks';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { HarborWithdrawTabs } from '@features/harbor/components/tabs';
import { useEffectOnce, useKeyboardHeight } from '@hooks';
import { isSmallScreen, scale } from '@utils';
import { styles } from './styles';

export const WithdrawHarborScreen = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const navigation = useNavigation<HarborNavigationProp>();
  const { getClaimAmount, updateAll, loading, setDefaultActiveAmbTiers } =
    useHarborStore();
  const { wallet } = useWalletStore();
  useEffectOnce(() => {
    getClaimAmount(wallet?.address || '');
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDefaultActiveAmbTiers();
      };
    }, [setDefaultActiveAmbTiers])
  );
  const RightContent = () => (
    <Button onPress={() => navigation.navigate('WithdrawRequests')}>
      <NoteIcon />
    </Button>
  );

  const refetchAll = async () => {
    updateAll(wallet?.address || '');
  };
  const extraHeight = isSmallScreen ? scale(100) : 0;
  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    if (keyboardHeight && isSmallScreen) {
      scrollRef.current?.scrollTo({ y: extraHeight });
    } else {
      scrollRef.current?.scrollTo({ y: 0 });
    }
  }, [extraHeight, keyboardHeight]);

  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }}>
      <Header
        title={`${t('harbor.withdraw.header')} AMB`}
        contentRight={<RightContent />}
      />
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={refetchAll}
            refreshing={loading}
            removeClippedSubviews
          />
        }
        style={styles.main}
        scrollToOverflowEnabled={false}
      >
        <View
          style={{
            ...styles.container,
            height: DEVICE_HEIGHT - top - scale(56) + extraHeight,
            paddingBottom: scale(16) + extraHeight
          }}
        >
          <HarborWithdrawTabs />
        </View>
      </ScrollView>
    </View>
  );
};
