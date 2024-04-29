import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@components/base';
import {
  BottomSheetEditCollection,
  AddressList,
  BottomSheetCreateRenameGroup
} from '@components/templates';
import { EditIcon, AddIcon } from '@components/svg/icons';
import { BottomSheetRef, Header } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { CommonStackNavigationProp, CommonStackParamsList } from '@appTypes';
import { useUSDPrice } from '@hooks';
import { useAllAddressesContext } from '@contexts';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { sortListByKey } from '@utils/sort';
import { styles } from './styles';
import { TokenLogo } from '@components/modular';

export const SingleGroupScreen = () => {
  const {
    params: {
      group: { id: groupId }
    }
  } = useRoute<RouteProp<CommonStackParamsList, 'Collection'>>();
  const navigation = useNavigation<CommonStackNavigationProp>();
  const { t } = useTranslation();

  const addNewAddressToGroupRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const editCollectionModalRef = useRef<BottomSheetRef>(null);
  const { handleOnRename, listsOfAddressGroup } = useLists((v) => v);
  const { refresh: refetchAddresses } = useAllAddressesContext((v) => v);
  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;

  const groupBalanceAmb = selectedList.totalBalance;
  const groupBalanceUsd = useUSDPrice(groupBalanceAmb);

  const showAddAddress = useCallback(() => {
    addNewAddressToGroupRef.current?.show();
  }, []);

  const showEditCollection = useCallback(() => {
    editCollectionModalRef.current?.show();
  }, []);

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1 }}
      testID="Single_Collection"
    >
      <Header
        bottomBorder
        title={
          <Text
            numberOfLines={1}
            fontFamily="Inter_700Bold"
            fontSize={16}
            color={COLORS.neutral900}
          >
            {selectedList.name}
          </Text>
        }
        centerContainerStyle={{
          maxWidth: '70%',
          alignItems: 'flex-start',
          paddingLeft: scale(28)
        }}
        style={{
          shadowColor: COLORS.transparent
        }}
        contentRight={
          <>
            <Button
              testID="Add_Address_Button"
              onPress={showAddAddress}
              type="circular"
              style={styles.addButton}
            >
              <AddIcon color={COLORS.neutral700} scale={1.5} />
            </Button>
            <Spacer horizontal value={scale(32)} />
            <Button
              testID="Edit_Collection_Button"
              onPress={showEditCollection}
              type="circular"
              style={styles.optionsButton}
            >
              <EditIcon color={COLORS.neutral900} />
            </Button>
          </>
        }
      />
      <Spacer value={32} />
      <View style={{ alignItems: 'center' }}>
        <Text
          color={COLORS.alphaBlack50}
          fontFamily="Inter_600SemiBold"
          fontSize={12}
        >
          {t('collection.total.balance')}
        </Text>
        <Spacer value={verticalScale(8)} />
        <View style={{ flexDirection: 'row' }}>
          <TokenLogo token={'AirDao'} />
          <Spacer horizontal value={verticalScale(8)} />
          <Text
            fontFamily="Inter_700Bold"
            fontWeight="800"
            fontSize={24}
            color={COLORS.neutral900}
          >
            {NumberUtils.formatNumber(
              groupBalanceAmb,
              groupBalanceAmb > 100000 ? 2 : 0
            )}
          </Text>
        </View>
        <Spacer value={5} />
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          ${NumberUtils.formatNumber(groupBalanceUsd, 2)}
        </Text>
      </View>
      <Spacer value={verticalScale(16)} />
      <View
        style={{ flex: 1, paddingHorizontal: scale(16) }}
        testID="List_Of_Addresses"
      >
        <AddressList
          data={sortListByKey(accounts || [], 'ambBalance', 'desc')}
          emptyText={''}
          isPortfolioFlow={true}
          removeType="collection"
          contentContainerStyle={{ paddingBottom: '10%' }}
          onRefresh={refetchAddresses}
        />
      </View>
      <BottomSheetAddNewAddressToGroup
        ref={addNewAddressToGroupRef}
        collection={selectedList}
      />
      <BottomSheetCreateRenameGroup
        type="rename"
        groupId={groupId}
        groupTitle={name}
        handleOnRenameGroup={handleOnRename}
        ref={groupRenameRef}
      />
      <BottomSheetEditCollection
        ref={editCollectionModalRef}
        collection={selectedList}
        onDelete={navigation.goBack}
      />
    </SafeAreaView>
  );
};
