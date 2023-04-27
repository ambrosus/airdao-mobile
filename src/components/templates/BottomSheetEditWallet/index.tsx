import React, {
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import { EditWallet } from '../EditWallet';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import { BottomSheetWithHeader } from '@components/modular';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { usePersonalList } from '@hooks/cache';
import { ExplorerAccount } from '@models/Explorer';
import { useAllAddressesReducer } from '@contexts';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';

interface BottomSheetEditWalletProps extends BottomSheetProps {
  wallet: ExplorerAccount;
  setIsDoneToolTipVisible?: React.Dispatch<SetStateAction<boolean>>;
}

export const BottomSheetEditWallet = forwardRef<
  BottomSheetRef,
  BottomSheetEditWalletProps
>((props, ref) => {
  const { wallet, setIsDoneToolTipVisible, ...bottomSheetProps } = props;
  const [isSaveToolTipVisible, setIsSaveToolTipVisible] =
    useState<boolean>(false);
  const allAddressesReducer = useAllAddressesReducer();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { personalList } = usePersonalList();
  const { handleStepChange, status } = useOnboardingStatus((v) => v);

  const [name, setName] = useState(wallet.name);
  const [isPersonalAddress, setIsPersonalAddress] = useState(
    personalList.indexOfItem(wallet, 'address') > -1
  );
  const saveAddress = async () => {
    const newWallet: ExplorerAccount = Object.assign({}, wallet);
    newWallet.name = name;
    newWallet.isPersonal = isPersonalAddress;
    allAddressesReducer({ type: 'update', payload: newWallet });
    localRef.current?.dismiss();
  };

  const handleSaveTooltipVisible = () => {
    setTimeout(() => setIsSaveToolTipVisible(true), 1000);
  };

  const handleActionPress = useCallback(() => {
    if (status === 'step-10' && setIsDoneToolTipVisible) {
      setIsSaveToolTipVisible(false);
      handleStepChange('step-11');
      setTimeout(() => {
        saveAddress();
      }, 0);
      setTimeout(() => {
        setIsDoneToolTipVisible(true);
      }, 3000);
    }
    saveAddress();
  }, [handleStepChange, saveAddress, setIsDoneToolTipVisible, status]);

  return (
    <BottomSheetWithHeader
      isToolTipVisible={isSaveToolTipVisible}
      isNestedSheet={true}
      title="Edit Address"
      ref={localRef}
      fullscreen
      avoidKeyboard={false}
      actionTitle="Save"
      onActionPress={handleActionPress}
      {...bottomSheetProps}
    >
      {wallet && (
        <EditWallet
          wallet={wallet}
          name={name}
          onNameChange={setName}
          isPersonalAddress={isPersonalAddress}
          onIsPersonalAddressChange={setIsPersonalAddress}
          handleSaveTooltipVisible={handleSaveTooltipVisible}
        />
      )}
    </BottomSheetWithHeader>
  );
});
