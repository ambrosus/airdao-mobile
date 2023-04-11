import React, { useReducer, useRef, useState } from 'react';
import { View } from 'react-native';
import { BottomSheetRef, CheckBox } from '@components/composite';
import { Button, Input, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon, PlusIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { BottomSheetCreateRenameGroup } from '../BottomSheetCreateRenameGroup';
import { useLists } from '@contexts/ListsContext';
import { AddAddressToList } from '../AddWalletToList';
import { BottomSheetWithHeader } from '@components/modular';
import {
  ListsOfAddressType,
  ListsOfAddressesGroupType
} from '@appTypes/ListsOfAddressGroup';
import { useFullscreenModalHeight } from '@hooks';
import { styles } from './styles';

interface EditAddressProps {
  address: ListsOfAddressType;
}

export const EditAddress = (props: EditAddressProps): JSX.Element => {
  const { address } = props;
  const {
    listsOfAddressGroup,
    setListsOfAddressGroup,
    handleOnCreate,
    createGroupRef
  } = useLists((v) => v);
  const fullscreenModalHeight = useFullscreenModalHeight();
  const [name, setName] = useState('');
  const [localLists, setLocalLists] = useState(listsOfAddressGroup);
  const [isPersonalAddress, toggleIsPersonalAddress] = useReducer(
    (state) => !state,
    false
  );

  const addToListModal = useRef<BottomSheetRef>(null);
  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };

  const showAddToListModal = () => {
    addToListModal.current?.show();
  };

  const saveNewLists = () => {
    setListsOfAddressGroup(localLists);
  };

  const onPressListItem = (list: ListsOfAddressesGroupType) => {
    const listFromLocalLists = localLists.find(
      (l) => l.groupId === list.groupId
    );
    if (!listFromLocalLists) return;
    const idx = listFromLocalLists.listOfAddresses.indexOfItem(
      address,
      'addressToken'
    );
    if (idx > -1) {
      listFromLocalLists.listOfAddresses.removeItem(address, 'addressToken');
      listFromLocalLists.addressesCount--;
    } else {
      listFromLocalLists.listOfAddresses.push(address);
      listFromLocalLists.addressesCount++;
    }
    setLocalLists([...localLists]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text title color="#222222">
          Address name
        </Text>
        <Spacer value={verticalScale(8)} />
        <Input
          placeholder="Placeholder"
          style={styles.input}
          value={name}
          onChangeValue={setName}
        />
        <Spacer value={24} />
        <Button onPress={toggleIsPersonalAddress}>
          <Row alignItems="center">
            <CheckBox
              type="square"
              value={isPersonalAddress}
              fillColor="#646464"
              color="#FFFFFF"
            />
            <Spacer horizontal value={12} />
            <Text title color="#162C5D">
              This is my peronal Address
            </Text>
          </Row>
        </Button>
        <Spacer value={12} />
        <Text fontWeight="400" color="#646464" fontSize={12}>
          {'Personal Addresses will be added to “My Addresses” by default'}
        </Text>
        <Spacer value={verticalScale(64)} />
        <Text title fontSize={20}>
          Add to Lists
        </Text>
        <Spacer value={verticalScale(12)} />
        <Button onPress={showAddToListModal}>
          <Row alignItems="center" justifyContent="space-between">
            <Text title>Select list</Text>
            <Row alignItems="center">
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={13}
                color="#828282"
              >
                None
                {/* TODO */}
              </Text>
              <Spacer horizontal value={scale(12)} />
              <ChevronRightIcon color="#828282" />
            </Row>
          </Row>
        </Button>
        <Spacer value={verticalScale(32)} />
        <Button
          type="circular"
          style={styles.newListButton}
          onPress={showCreateNewListModal}
        >
          <Row alignItems="center">
            <PlusIcon color="#000000" />
            <Text title> Create new list</Text>
          </Row>
        </Button>
      </View>
      <BottomSheetCreateRenameGroup
        ref={createGroupRef}
        type="create"
        handleOnCreateGroup={handleOnCreate}
      />
      <BottomSheetWithHeader
        ref={addToListModal}
        height={fullscreenModalHeight}
        title="Add to lists"
        actionTitle="Save"
        onActionPress={saveNewLists}
      >
        <AddAddressToList
          address={address}
          lists={localLists}
          onPressList={onPressListItem}
        />
      </BottomSheetWithHeader>
    </View>
  );
};
