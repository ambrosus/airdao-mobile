import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountActionButton } from './ActionButton';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { useSendCryptoContext } from '@contexts';
import { ExplorerAccount, Token } from '@models';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { SendAccountActionIcon } from '@components/svg/icons/v2/actions';

interface SendProps {
  account: ExplorerAccount;
  token?: Token;
  disabled: () => boolean;
}

export const Send = ({ account, token, disabled }: SendProps) => {
  const { t } = useTranslation();
  const sendCryptoContextReducer = useSendCryptoContext((v) => v.reducer);
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToSendScreen = useCallback(() => {
    sendCryptoContextReducer({ type: 'RESET_DATA' });
    sendCryptoContextReducer({
      type: 'SET_DATA',
      from: account.address,
      to: ''
    });
    setTimeout(() => {
      sendFirebaseEvent(CustomAppEvents.main_send);
      navigation.navigate('SendFunds', { token });
    }, 0);
  }, [account, navigation, sendCryptoContextReducer, token]);

  return (
    <AccountActionButton
      Icon={({ color }) => <SendAccountActionIcon color={color} />}
      text={t('account.actions.send')}
      onPress={navigateToSendScreen}
      isActive={disabled()}
    />
  );
};
