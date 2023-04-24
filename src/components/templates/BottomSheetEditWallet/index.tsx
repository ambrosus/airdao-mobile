import React, { ForwardedRef, forwardRef, useState } from 'react';
import { EditWallet } from '../EditWallet';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import { BottomSheetWithHeader } from '@components/modular';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { usePersonalList } from '@hooks/cache';
import { ExplorerAccount } from '@models/Explorer';
import { useAllAddressesReducer } from '@contexts';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';

interface BottomSheetEditWalletProps extends BottomSheetProps {
  wallet: ExplorerAccount;
  status: OnBoardingStatus;
}

export const BottomSheetEditWallet = forwardRef<
  BottomSheetRef,
  BottomSheetEditWalletProps
>((props, ref) => {
  const { wallet, ...bottomSheetProps } = props;
  const allAddressesReducer = useAllAddressesReducer();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { personalList } = usePersonalList();
  const [name, setName] = useState(wallet.name);
  const [isPersonalAddress, setIsPersonalAddress] = useState(
    personalList.indexOfItem(wallet, 'address') > -1
  );

  const { status = 'step-5' } = useOnboardingStatus((v) => v);

  const saveAddress = async () => {
    const newWallet: ExplorerAccount = Object.assign({}, wallet);
    newWallet.name = name;
    newWallet.isPersonal = isPersonalAddress;
    allAddressesReducer({ type: 'update', payload: newWallet });
    localRef.current?.dismiss();
  };

  return (
    <BottomSheetWithHeader
      title="Edit Address"
      ref={localRef}
      fullscreen
      avoidKeyboard={false}
      actionTitle="Save"
      onActionPress={saveAddress}
      {...bottomSheetProps}
    >
      {wallet && (
        <EditWallet
          status={status}
          wallet={wallet}
          name={name}
          onNameChange={setName}
          isPersonalAddress={isPersonalAddress}
          onIsPersonalAddressChange={setIsPersonalAddress}
        />
      )}
    </BottomSheetWithHeader>
  );
});
