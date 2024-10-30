import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import AirDAOKeysStorage from '@lib/crypto/AirDAOKeysStorage';

interface AccessKeysMnemonicProps {
  walletHash: string;
}

export const AccessKeysMnemonicTab = ({
  walletHash
}: AccessKeysMnemonicProps) => {
  const { t } = useTranslation();
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string[]>([]);

  useEffect(() => {
    if (walletHash) {
      (async () => {
        const mnemonic = (
          await AirDAOKeysStorage.getWalletMnemonic(walletHash)
        ).split(' ');
        setMnemonicPhrase(mnemonic);
      })();
    }
  }, [walletHash]);

  const borderRadiusByIndex = useCallback(
    (index: number): StyleProp<ViewStyle> => {
      if (index % 2 !== 0) {
        return {
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          borderLeftWidth: 0.5,
          borderLeftColor: COLORS.neutral200
        };
      }

      return {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
      };
    },
    []
  );

  const renderMnemonicWordListItem = useCallback(
    (args: ListRenderItemInfo<string>) => {
      return (
        <View
          style={[styles.mnemonicWordListItem, borderRadiusByIndex(args.index)]}
        >
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral400}
          >
            {args.index + 1}
          </Text>
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
          >
            {args.item}
          </Text>
        </View>
      );
    },
    [borderRadiusByIndex]
  );

  return (
    <View style={styles.container}>
      <Spacer value={scale(18)} />
      <Text
        fontSize={scale(16)}
        fontFamily="Inter_400Regular"
        color={COLORS.neutral800}
        style={styles.heading}
      >
        {t('singleWallet.tab.phrase.warn')}
      </Text>
      <Spacer value={scale(24)} />

      <FlatList
        data={mnemonicPhrase}
        renderItem={renderMnemonicWordListItem}
        numColumns={2}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
};
