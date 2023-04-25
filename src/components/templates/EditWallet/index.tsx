import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { View } from 'react-native';
import { BottomSheetRef, CheckBox } from '@components/composite';
import { Button, Input, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon, PlusIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { BottomSheetCreateRenameGroup } from '../BottomSheetCreateRenameGroup';
import { useLists } from '@contexts/ListsContext';
import { AddWalletToList } from '../AddWalletToList';
import { BottomSheetWithHeader } from '@components/modular';
import { useFullscreenModalHeight } from '@hooks';
import { ExplorerAccount } from '@models/Explorer';
import { AccountList } from '@models/AccountList';
import { styles } from './styles';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { COLORS } from '@constants/colors';

interface EditWalletProps {
  wallet: ExplorerAccount;
  name: string;
  isPersonalAddress: boolean;
  onNameChange: (newName: string) => unknown;
  onIsPersonalAddressChange: (newFlag: boolean) => unknown;
}

export const EditWallet = (props: EditWalletProps): JSX.Element => {
  const {
    wallet,
    name,
    isPersonalAddress,
    onIsPersonalAddressChange,
    onNameChange
  } = props;
  const {
    listsOfAddressGroup,
    setListsOfAddressGroup,
    handleOnCreate,
    createGroupRef
  } = useLists((v) => v);

  const { status, handleStepChange } = useOnboardingStatus((v) => v);
  const [activeToolTip, setActiveToolTip] = useState<
    'input' | 'checkbox' | 'button' | null
  >(null);
  const {
    title,
    subtitle,
    buttonRightTitle,
    buttonLeftTitle,
    isButtonLeftVisible
  } = useOnboardingToolTip(status);

  const currentTooltip = useCallback((newStatus: OnBoardingStatus) => {
    return newStatus === 'step-5'
      ? 'input'
      : newStatus === 'step-6'
      ? 'checkbox'
      : newStatus === 'step-7'
      ? 'button'
      : null;
  }, []);

  console.log(activeToolTip, status);

  useEffect(() => {
    setTimeout(() => setActiveToolTip(currentTooltip(status)), 2000);
  }, [status]);

  const handleOnboardingStepChange = (amount: number) => {
    // const nextStep: OnBoardingStatus =
    //   'step-' + (parseInt(status.slice(-1), 10) + amount);

    const lastNumber = +status.match(/(\d+)$/)[1] + amount;

    const outputString = status.replace(/(\d+)$/, lastNumber);
    handleStepChange(outputString);
    setActiveToolTip(currentTooltip(outputString));
  };

  const fullscreenModalHeight = useFullscreenModalHeight();
  const [localLists, setLocalLists] = useState(listsOfAddressGroup);

  const selectedLists = listsOfAddressGroup.filter(
    (list) =>
      list.accounts.findIndex((account) => account.address === wallet.address) >
      -1
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
  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };

  const showAddToListModal = () => {
    addToListModal.current?.show();
  };

  const hideAddToListModal = () => {
    addToListModal.current?.dismiss();
  };

  const saveNewLists = async () => {
    // TODO refactor lists and use lists context
    setListsOfAddressGroup(
      localLists.map((l) => ({
        ...l,
        addresses: l.accounts.map((account) => account.address)
      }))
    );
    hideAddToListModal();
  };

  const onPressListItem = (list: AccountList) => {
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text title color="#222222" fontFamily="Inter_600SemiBold">
          Address name
        </Text>
        <Spacer value={verticalScale(8)} />
        <Tooltip
          tooltipStyle={{ flex: 1 }}
          contentStyle={{ height: 152, borderRadius: 8 }}
          arrowSize={{ width: 16, height: 8 }}
          backgroundColor="rgba(0,0,0,0.5)"
          isVisible={activeToolTip === 'input'}
          content={
            <OnBoardingToolTipBody
              title={title}
              buttonRightTitle={buttonRightTitle}
              subtitle={subtitle}
              buttonLeftTitle={buttonLeftTitle}
              handleButtonRightPress={() => handleOnboardingStepChange(1)}
              handleButtonLeftPress={() => handleOnboardingStepChange(-1)}
              isButtonLeftVisible={isButtonLeftVisible}
            />
          }
          placement="bottom"
          onClose={() => null}
        >
          <Input
            onBlur={() => {
              setActiveToolTip('checkbox');
              handleOnboardingStepChange(1);
            }}
            placeholder="Placeholder"
            style={styles.input}
            value={name}
            onChangeValue={onNameChange}
          />
        </Tooltip>
        <Spacer value={24} />
        <Tooltip
          tooltipStyle={{ flex: 1 }}
          contentStyle={{ height: 136, borderRadius: 8 }}
          arrowSize={{ width: 16, height: 8 }}
          backgroundColor="rgba(0,0,0,0.5)"
          isVisible={activeToolTip === 'checkbox'}
          content={
            <OnBoardingToolTipBody
              title={title}
              buttonRightTitle={buttonRightTitle}
              subtitle={subtitle}
              buttonLeftTitle={buttonLeftTitle}
              handleButtonRightPress={() => handleOnboardingStepChange(1)}
              handleButtonLeftPress={() => handleOnboardingStepChange(-1)}
              isButtonLeftVisible={isButtonLeftVisible}
            />
          }
          placement="bottom"
          onClose={() => null}
        >
          <View
            style={{
              // TODO fix styles of container paddings
              borderWidth: 1,
              borderRadius: 10,
              padding: 7,
              borderColor: 'white'
            }}
          >
            <Button
              onPress={() => {
                onIsPersonalAddressChange(!isPersonalAddress);
                handleOnboardingStepChange(1);
              }}
            >
              <Row alignItems="center">
                <CheckBox
                  type="square"
                  value={isPersonalAddress}
                  fillColor="#646464"
                  color="#FFFFFF"
                />
                <Spacer horizontal value={12} />
                <Text title color={COLORS.black} fontFamily="Inter_600SemiBold">
                  This is my personal Address
                </Text>
              </Row>
            </Button>
            <Spacer value={12} />
            <Text
              fontWeight="400"
              color="#646464"
              fontSize={12}
              fontFamily="Inter_600SemiBold"
            >
              {'Personal Addresses will be added to “My Addresses” by default'}
            </Text>
          </View>
        </Tooltip>
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
        <Tooltip
          tooltipStyle={{ flex: 1 }}
          contentStyle={{ height: 152, borderRadius: 8 }}
          arrowSize={{ width: 16, height: 8 }}
          backgroundColor="rgba(0,0,0,0.5)"
          isVisible={activeToolTip === 'button'}
          content={
            <OnBoardingToolTipBody
              title={title}
              buttonRightTitle={buttonRightTitle}
              subtitle={subtitle}
              buttonLeftTitle={buttonLeftTitle}
              handleButtonRightPress={() => handleOnboardingStepChange(1)}
              handleButtonLeftPress={() => handleOnboardingStepChange(-1)}
              isButtonLeftVisible={isButtonLeftVisible}
            />
          }
          placement="top"
          onClose={() => null}
        >
          <Button
            type="circular"
            style={styles.newListButton}
            onPress={() => {
              showCreateNewListModal();
              handleOnboardingStepChange(1);
            }}
          >
            <Row alignItems="center">
              <PlusIcon color="#000000" />
              <Text title fontFamily="Inter_600SemiBold">
                {'  '}
                Create new list
              </Text>
            </Row>
          </Button>
        </Tooltip>
      </View>
      <BottomSheetCreateRenameGroup
        status={status}
        ref={createGroupRef}
        type="create"
        handleOnCreateGroup={handleOnCreate}
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
