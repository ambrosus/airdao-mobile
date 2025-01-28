import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';
import { SendAccountActionIcon } from '@components/svg/icons/v2/actions';
import { useSendFundsStore } from '@features/send-funds';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { ExplorerAccount, Token } from '@models';
import { AccountActionButton } from './ActionButton';

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
