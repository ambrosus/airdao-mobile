import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet } from '@components/composite';
import { CloseCircleIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import {
  useWalletConnectContextSelector,
  useHandleBottomSheetActions
} from '@features/wallet-connect/lib/hooks';
import { verticalScale } from '@utils';
import { styles } from './styles';
import { WalletSessionsList } from '../../composite';

export const WalletSessionsBottomSheet = () => {
  const { t } = useTranslation();
  const { activeSessionsBottomSheetRef } = useWalletConnectContextSelector();
  const { onDismissActiveSessionBottomSheet } = useHandleBottomSheetActions();

  return (
    <BottomSheet swipingEnabled={false} ref={activeSessionsBottomSheetRef}>
      <View style={styles.container}>
        <Row
          style={styles.header}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            fontSize={20}
            fontFamily="Inter_600SemiBold"
            color={COLORS.black}
          >
            {t('wallet.connect.title.connections')}
          </Text>

          <Pressable
            onPress={onDismissActiveSessionBottomSheet}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <CloseCircleIcon />
          </Pressable>
        </Row>

        <Spacer value={verticalScale(16)} />
        <WalletSessionsList />
      </View>
      <Spacer value={16} />
    </BottomSheet>
  );
};
