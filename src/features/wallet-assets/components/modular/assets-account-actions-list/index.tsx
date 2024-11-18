import React, { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Row } from '@components/base';
import { AccountActionItem } from '../../base';
import { QRCodeIcon } from '@components/svg/icons/v2';
import { SendAccountActionIcon } from '@components/svg/icons/v2/actions';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { COLORS } from '@constants/colors';
import { Token } from '@models';
import { HomeNavigationProp } from '@appTypes';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { ReceiveFunds } from '@components/templates';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSendFundsStore } from '@features/send-funds';

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
