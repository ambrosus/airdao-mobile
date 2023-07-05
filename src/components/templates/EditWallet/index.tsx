import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { BottomSheetRef, CheckBox } from '@components/composite';
import { Button, Input, InputRef, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon, PlusIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { BottomSheetCreateRenameGroup } from '../BottomSheetCreateRenameGroup';
import { useLists } from '@contexts/ListsContext';
import { AddWalletToList } from '../AddWalletToList';
import { BottomSheetWithHeader } from '@components/modular';
import { useFullscreenModalHeight } from '@hooks';
import { ExplorerAccount } from '@models/Explorer';
import { useOnboardingStatus } from '@contexts';
import { OnboardingView } from '../OnboardingView';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

interface EditWalletProps {
  wallet: ExplorerAccount;
  name: string;
  isPersonalAddress: boolean;
  onNameChange: (newName: string) => unknown;
  onIsPersonalAddressChange: (newFlag: boolean) => unknown;
  onboardingProps?: {
    onAddressNameTooltipBackPress: () => unknown;
  };
}

export const EditWallet = (props: EditWalletProps): JSX.Element => {
  const {
    wallet,
    name,
    isPersonalAddress,
    onboardingProps = { onAddressNameTooltipBackPress: () => null },
    onIsPersonalAddressChange,
    onNameChange
  } = props;
  const {
    listsOfAddressGroup,
    setListsOfAddressGroup,
    handleOnCreate,
    createGroupRef
  } = useLists((v) => v);
  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };
  const { status } = useOnboardingStatus((v) => v);

  const fullscreenModalHeight = useFullscreenModalHeight();
  const [localLists, setLocalLists] = useState(listsOfAddressGroup);
  const nameInput = useRef<InputRef>(null);

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

  const setOnboardingAddress = () => {
    onNameChange('Demo Address');
    nameInput.current?.setText('Demo Address');
  };

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
    setListsOfAddressGroup(
      localLists.map((l) => ({
        ...l,
        addresses: l.accounts.map((account) => account.address)
      }))
    );
    hideAddToListModal();
  }, [localLists, setListsOfAddressGroup]);

  return (
    <View style={styles.container} testID="EditWallet_Container">
      <Text title color="#222222" fontFamily="Inter_600SemiBold">
        Address name
      </Text>
      <Spacer value={verticalScale(8)} />
      <OnboardingView
        thisStep={5}
        tooltipPlacement="bottom"
        childrenAlwaysVisible
        helpers={{
          next: setOnboardingAddress,
          back: onboardingProps.onAddressNameTooltipBackPress
        }}
      >
        <Input
          testID="Edit_Wallet_Input"
          ref={nameInput}
          placeholder="Placeholder"
          style={styles.input}
          value={name}
          onChangeValue={onNameChange}
          editable={status !== '5'}
        />
      </OnboardingView>
      <Spacer value={24} />
      <OnboardingView
        thisStep={6}
        tooltipPlacement="bottom"
        childrenAlwaysVisible
        helpers={{ next: () => onIsPersonalAddressChange(true) }}
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
            testID="EditWallet_Personal_Address_Switch"
            onPress={() => {
              onIsPersonalAddressChange(!isPersonalAddress);
            }}
          >
            <Row alignItems="center">
              <CheckBox
                testID="EditWallet_Checkbox"
                type="square"
                value={isPersonalAddress}
                fillColor={COLORS.sapphireBlue}
                color={COLORS.white}
              />
              <Spacer horizontal value={12} />
              <Text
                title
                color={COLORS.navyIndigo}
                fontFamily="Inter_600SemiBold"
              >
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
      </OnboardingView>
      <Spacer value={verticalScale(32)} />
      <View style={styles.separator} />
      <Spacer value={verticalScale(32)} />
      <Text fontSize={20} fontFamily="Inter_700Bold">
        Add to Lists
      </Text>
      <Spacer value={verticalScale(12)} />
      {Platform.OS === 'ios' ? (
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
      ) : (
        <Button onPress={showAddToListModal}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Text title fontFamily="Inter_600SemiBold">
              Select list
            </Text>
            <Spacer value={scale(10)} />
            <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#828282">
              {selectedListText}
            </Text>
          </View>
        </Button>
      )}
      <Spacer value={verticalScale(32)} />
      <OnboardingView
        thisStep={7}
        childrenAlwaysVisible
        tooltipPlacement="top"
        helpers={{
          next: () => {
            setTimeout(() => {
              showCreateNewListModal();
            }, 100);
          }
        }}
      >
        <Button
          type="circular"
          style={styles.newListButton}
          onPress={() => {
            showCreateNewListModal();
          }}
        >
          <Row alignItems="center">
            <PlusIcon color={COLORS.deepBlue} />
            <Text
              style={{ left: 10.5 }}
              title
              fontFamily="Inter_600SemiBold"
              color={COLORS.deepBlue}
            >
              Create new list
            </Text>
          </Row>
        </Button>
      </OnboardingView>
      {/* <EditWalletButtonToolTip /> */}
      <BottomSheetCreateRenameGroup
        ref={createGroupRef}
        type="create"
        handleOnCreateGroup={handleOnCreate}
      />
      <BottomSheetWithHeader
        isNestedSheet
        ref={addToListModal}
        height={
          Platform.OS === 'ios'
            ? fullscreenModalHeight
            : Dimensions.get('screen').height
        }
        title="Add to lists"
        actionTitle={Platform.OS === 'ios' ? 'Save' : ''}
        onActionPress={Platform.OS === 'ios' ? saveNewLists : undefined}
      >
        <AddWalletToList wallet={wallet} lists={localLists} />
      </BottomSheetWithHeader>
    </View>
  );
};
