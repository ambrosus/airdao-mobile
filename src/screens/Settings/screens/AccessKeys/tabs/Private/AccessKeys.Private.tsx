import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { Cache, CacheKey } from '@lib/cache';
import { scale } from '@utils';
import { styles } from './styles';

interface AccessKeysPrivateProps {
  walletHash: string;
}

export const AccessKeysPrivateTab = ({
  walletHash
}: AccessKeysPrivateProps) => {
  const { t } = useTranslation();
  const [privateKey, setPrivateKey] = useState<string>();

  useEffect(() => {
    (async () => {
      setPrivateKey(
        (await Cache.getItem(
          `${CacheKey.WalletPrivateKey}-${walletHash}`
        )) as string
      );
    })();
  }, [walletHash]);

  return (
    <View style={styles.container}>
      <Spacer value={scale(29)} />
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral900}
        style={styles.privateKey}
      >
        {privateKey}
      </Text>
      <Spacer value={scale(24)} />
      <CopyToClipboardButton
        disableWhenCopied
        textToDisplay={t('common.copy')}
        textToCopy={privateKey}
        pressableText={true}
        showToast={false}
        iconProps={{ scale: 0 }}
        containerStyle={styles.copyButton}
        textProps={{
          color: COLORS.brand500,
          fontSize: 14,
          fontFamily: 'Inter_500Medium'
        }}
        successTextProps={{
          color: COLORS.brand500,
          fontSize: 14,
          fontFamily: 'Inter_500Medium'
        }}
      />
    </View>
  );
};
