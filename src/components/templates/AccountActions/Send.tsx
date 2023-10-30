import React from 'react';
import { useTranslation } from 'react-i18next';
import { SendIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { useSendCryptoContext } from '@contexts';

interface SendProps {
  address: string;
}

export const Send = (props: SendProps) => {
  const { t } = useTranslation();
  const sendCryptoContextReducer = useSendCryptoContext((v) => v.reducer);
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToSendScreen = () => {
    sendCryptoContextReducer({ type: 'RESET_DATA' });
    sendCryptoContextReducer({
      type: 'SET_DATA',
      from: props.address,
      to: ''
    });
    setTimeout(() => {
      navigation.navigate('SendFunds');
    }, 0);
  };

  return (
    <AccountActionButton
      Icon={SendIcon}
      text={t('account.actions.send')}
      isActive={Config.walletActions.send}
      onPress={navigateToSendScreen}
    />
  );
};
