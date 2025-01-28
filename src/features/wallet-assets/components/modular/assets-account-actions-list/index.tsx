import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';
import { Row } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { QRCodeIcon } from '@components/svg/icons/v2';
import { SendAccountActionIcon } from '@components/svg/icons/v2/actions';

import { ReceiveFunds } from '@components/templates';
import { COLORS } from '@constants/colors';
import { useSendFundsStore } from '@features/send-funds';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { Token } from '@models';
import { styles } from './styles';
import { AccountActionItem } from '../../base';

interface AssetsAccountActionsListProps {
  address: string;
  token: Token;
}

export const AssetsAccountActionsList = ({
  address,
  token
}: AssetsAccountActionsListProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const { onChangeWithResetState } = useSendFundsStore();

  const receiveFundsBottomSheetRef = useRef<BottomSheetRef>(null);

  const onSendPress = useCallback(() => {
    onChangeWithResetState({
      from: address,
      to: ''
    });
    setTimeout(() => {
      sendFirebaseEvent(CustomAppEvents.main_send);
      navigation.navigate('SendFunds', { token });
    });
  }, [address, navigation, onChangeWithResetState, token]);

  const onReceiveFundsPress = useCallback(
    () => receiveFundsBottomSheetRef.current?.show(),
    []
  );

  return (
    <>
      <Row alignItems="center" style={styles.container}>
        <AccountActionItem
          label={t('account.actions.receive')}
          action={onReceiveFundsPress}
          icon={<QRCodeIcon color={COLORS.brand600} />}
        />
        <AccountActionItem
          label={t('account.actions.send')}
          action={onSendPress}
          icon={<SendAccountActionIcon color={COLORS.brand600} />}
        />
      </Row>

      <BottomSheet title="Receive" ref={receiveFundsBottomSheetRef}>
        <View style={styles.receiveFundsBottomSheetContainer}>
          <ReceiveFunds address={address} />
        </View>
      </BottomSheet>
    </>
  );
};
