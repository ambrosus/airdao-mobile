import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { View } from 'react-native';
import { BottomSheetRef } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { BottomSheetCreateRenameGroup } from '../BottomSheetCreateRenameGroup';
import { useLists } from '@contexts/ListsContext';
import { AddWalletToList } from '../AddWalletToList';
import { BottomSheetWithHeader } from '@components/modular';
import { useFullscreenModalHeight } from '@hooks';
import { ExplorerAccount } from '@models/Explorer';
import { AccountList } from '@models/AccountList';
import { styles } from './styles';
import { EditWalletInputToolTip } from '@components/templates/EditWallet/components/EditWalletInputToolTip';
import { EditWalletCheckboxToolTip } from '@components/templates/EditWallet/components/EditWalletCheckboxToolTip';
import { EditWalletButtonToolTip } from '@components/templates/EditWallet/components/EditWalletButtonToolTip';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';

interface EditWalletProps {
  wallet: ExplorerAccount;
  name: string;
  isPersonalAddress: boolean;
  onNameChange: (newName: string) => unknown;
  onIsPersonalAddressChange: (newFlag: boolean) => unknown;
  handleSaveTooltipVisible?: () => void;
}

export const EditWallet = (props: EditWalletProps): JSX.Element => {
  const {
    wallet,
    name,
    isPersonalAddress,
    onIsPersonalAddressChange,
    onNameChange,
    handleSaveTooltipVisible
  } = props;
  const {
    listsOfAddressGroup,
    setListsOfAddressGroup,
    handleOnCreate,
    createGroupRef
  } = useLists((v) => v);
  const { status, handleStepChange, handleSkipTutorial } = useOnboardingStatus(
    (v) => v
  );
  const fullscreenModalHeight = useFullscreenModalHeight();
  const [localLists, setLocalLists] = useState(listsOfAddressGroup);
  const [showFirstToolTip, setShowFirstToolTip] = useState<boolean>(false);
  const [
    isCreateBottomSheetAnimationFinished,
    setIsCreateBottomSheetAnimationFinished
  ] = useState<boolean>(false);

  const selectedLists = useMemo(
    () =>
      listsOfAddressGroup.filter(
        (list) =>
          list.accounts.findIndex(
            (account) => account.address === wallet.address
          ) > -1
      ),
    [listsOfAddressGroup, wallet.address]
  );

  useEffect(() => {
    setLocalLists(listsOfAddressGroup);
  }, [listsOfAddressGroup]);

  const selectedListText = useMemo(() => {
    if (selectedLists.length === 0) return 'None';
    if (selectedLists.length === 1) return selectedLists[0].name;
    return `${selectedLists.length} lists`;
  }, [selectedLists]);

  const addToListModal = useRef<BottomSheetRef>(null);

  const showAddToListModal = () => {
    addToListModal.current?.show();
  };

  const hideAddToListModal = () => {
    addToListModal.current?.dismiss();
  };

  const saveNewLists = useCallback(async () => {
    // TODO refactor lists and use lists context
    setListsOfAddressGroup(
      localLists.map((l) => ({
        ...l,
        addresses: l.accounts.map((account) => account.address)
      }))
    );
    hideAddToListModal();
  }, [localLists, setListsOfAddressGroup]);

  const onPressListItem = useCallback(
    (list: AccountList) => {
      const listFromLocalLists = localLists.find((l) => l.id === list.id);
      if (!listFromLocalLists) return;
      const idx = listFromLocalLists.accounts.findIndex(
        (account) => account.address === wallet.address
      );
      if (idx > -1) {
        listFromLocalLists.accounts.splice(idx, 1);
      } else {
        listFromLocalLists.accounts.push(wallet);
      }
      setLocalLists([...localLists]);
    },
    [localLists, wallet]
  );

  const handleOnboardingStepChange = useCallback(
    (amount: number) => {
      if (status !== 'none') {
        const currentStep = parseInt(status.slice(-1), 10);

        // @ts-ignore
        const nextStep: OnBoardingStatus = `step-${currentStep + amount}`;
        handleStepChange(nextStep);
        if (nextStep === 'step-8') {
          setTimeout(() => setIsCreateBottomSheetAnimationFinished(true), 1500);
        }
      }
    },
    [status, handleStepChange]
  );

  // call only once, wait when bottomsheet will be opened
  useEffect(() => {
    setTimeout(() => setShowFirstToolTip(true), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text title color="#222222" fontFamily="Inter_600SemiBold">
          Address name
        </Text>
        <Spacer value={verticalScale(8)} />
        <EditWalletInputToolTip
          isActiveToolTip={status === 'step-5' && showFirstToolTip}
          handleOnboardingStepChange={handleOnboardingStepChange}
          name={name}
          onNameChange={onNameChange}
        />
        <Spacer value={24} />
        <EditWalletCheckboxToolTip
          isActiveToolTip={status === 'step-6'}
          handleOnboardingStepChange={handleOnboardingStepChange}
          onIsPersonalAddressChange={onIsPersonalAddressChange}
          isPersonalAddress={isPersonalAddress}
        />
        <Spacer value={verticalScale(32)} />
        <View style={styles.separator} />
        <Spacer value={verticalScale(32)} />
        <Text fontSize={20} fontFamily="Inter_700Bold">
          Add to Lists
        </Text>
        <Spacer value={verticalScale(12)} />
        <Button onPress={showAddToListModal}>
          <Row alignItems="center" justifyContent="space-between">
            <Text title fontFamily="Inter_600SemiBold">
              Select list
            </Text>
            <Row alignItems="center">
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={13}
                color="#828282"
              >
                {selectedListText}
              </Text>
              <Spacer horizontal value={scale(12)} />
              <ChevronRightIcon color="#828282" />
            </Row>
          </Row>
        </Button>
        <Spacer value={verticalScale(32)} />
        <EditWalletButtonToolTip
          isActiveToolTip={status === 'step-7'}
          handleOnboardingStepChange={handleOnboardingStepChange}
        />
      </View>
      <BottomSheetCreateRenameGroup
        ref={createGroupRef}
        type="create"
        handleOnCreateGroup={handleOnCreate}
        handleSaveTooltipVisible={handleSaveTooltipVisible}
        status={status}
        handleStepChange={handleStepChange}
        handleSkipTutorial={handleSkipTutorial}
        isAnimationFinished={isCreateBottomSheetAnimationFinished}
      />
      <BottomSheetWithHeader
        isNestedSheet
        ref={addToListModal}
        height={fullscreenModalHeight}
        title="Add to lists"
        actionTitle="Save"
        onActionPress={saveNewLists}
      >
        <AddWalletToList
          wallet={wallet}
          lists={localLists}
          onPressList={onPressListItem}
        />
      </BottomSheetWithHeader>
    </View>
  );
};
