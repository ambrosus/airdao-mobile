import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useState
} from 'react';
import { EditWallet } from '../EditWallet';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
  Header
} from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { usePersonalList } from '@hooks/cache';
import { ExplorerAccount } from '@models/Explorer';
import {
  useAllAddressesReducer,
  useLists,
  useOnboardingStatus
} from '@contexts';
import { Platform } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { CloseIcon } from '@components/svg/icons';
import { OnboardingView } from '../OnboardingView';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

interface BottomSheetEditWalletProps extends BottomSheetProps {
  wallet: ExplorerAccount;
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
  const { status, registerHelpers } = useOnboardingStatus((v) => v);
  const { createGroupRef } = useLists((v) => v);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveAddress = async () => {
    const newWallet: ExplorerAccount = Object.assign({}, wallet);
    newWallet.name = name;
    newWallet.isPersonal = isPersonalAddress;
    allAddressesReducer({ type: 'update', payload: newWallet });
    localRef.current?.dismiss();
  };

  const dismiss = useCallback(() => {
    localRef.current?.dismiss();
  }, [localRef]);

  useEffect(() => {
    if (status === 10) {
      // register helpers for save address tooltip
      registerHelpers({
        next: saveAddress,
        back: () => {
          setTimeout(() => {
            createGroupRef.current?.show();
          }, 500);
        }
      });
    }
  }, [status, createGroupRef, registerHelpers, saveAddress, dismiss]);

  const renderContentRight = () => {
    const isToolTipVisible = status === 10;
    return (
      <OnboardingView
        thisStep={10}
        childrenAlwaysVisible
        tooltipPlacement="left"
        contentStyle={{ marginTop: verticalScale(20) }}
      >
        <Button onPress={saveAddress}>
          <Text color={isToolTipVisible ? COLORS.white : COLORS.jungleGreen}>
            Save
          </Text>
        </Button>
      </OnboardingView>
    );
  };

  return (
    <BottomSheet
      ref={localRef}
      fullscreen
      avoidKeyboard={false}
      {...bottomSheetProps}
    >
      <>
        {Platform.OS === 'android' && <Spacer value={scale(57)} />}
        <Header
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            <Button onPress={dismiss}>
              <CloseIcon />
            </Button>
          }
          contentRight={renderContentRight()}
          titleStyle={styles.headerTitle}
          title="Edit Address"
        />
        {wallet && (
          <EditWallet
            wallet={wallet}
            name={name}
            onNameChange={setName}
            isPersonalAddress={isPersonalAddress}
            onIsPersonalAddressChange={setIsPersonalAddress}
            onboardingProps={{ onAddressNameTooltipBackPress: dismiss }}
          />
        )}
      </>
    </BottomSheet>
  );
});
