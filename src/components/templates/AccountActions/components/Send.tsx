import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountActionButton } from './ActionButton';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { ExplorerAccount, Token } from '@models';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { SendAccountActionIcon } from '@components/svg/icons/v2/actions';
import { useSendFundsStore } from '@features/send-funds';

interface SendProps {
  account: ExplorerAccount;
  token?: Token;
  disabled: () => boolean;
}

export const Send = ({ account, token, disabled }: SendProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const { onChangeWithResetState } = useSendFundsStore();

  const navigateToSendScreen = useCallback(() => {
    onChangeWithResetState({
      from: account.address,
      to: ''
    });
    setTimeout(() => {
      sendFirebaseEvent(CustomAppEvents.main_send);
      navigation.navigate('SendFunds', { token });
    }, 0);
  }, [account.address, navigation, onChangeWithResetState, token]);

  return (
    <AccountActionButton
      Icon={({ color }) => <SendAccountActionIcon color={color} />}
      text={t('account.actions.send')}
      onPress={navigateToSendScreen}
      isActive={disabled()}
    />
  );
};
