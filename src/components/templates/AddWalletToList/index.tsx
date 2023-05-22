import React, { useMemo, useState } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { CheckBox, InputWithIcon } from '@components/composite';
import { scale, verticalScale } from '@utils/scaling';
import { styles } from './styles';
import { ExplorerAccount } from '@models/Explorer';
import { AccountList } from '@models/AccountList';
import { COLORS } from '@constants/colors';
import { SearchIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';

interface AddWalletToListProps {
  wallet: ExplorerAccount;
  lists: AccountList[];
  onPressList: (list: AccountList) => unknown;
}

export const AddWalletToList = (props: AddWalletToListProps): JSX.Element => {
  const { wallet, lists, onPressList } = props;
  const [searchText, setSearchText] = useState('');
  const filteredLists = useMemo(
    () =>
      searchText ? lists.filter((l) => l.name.includes(searchText)) : lists,
    [lists, searchText]
  );

  const renderList = (args: ListRenderItemInfo<AccountList>) => {
    const { item: list } = args;
    const selected = list.accounts.indexOfItem(wallet, 'address') > -1;
    const onPress = () => {
      onPressList(list);
    };

    return (
      <Button
        onPress={onPress}
        testID="AddWalletToList_Container"
        style={styles.item}
      >
        <Row alignItems="center" justifyContent="space-between">
          {selected && (
            <>
              <CheckBox
                testID="AddWalletToList_Checkbox"
                type="square"
                value={selected}
                fillColor={COLORS.sapphireBlue}
                color="#FFFFFF"
              />
              <Spacer value={scale(16)} horizontal />
            </>
          )}
          <View style={{ flex: 1 }}>
            <Row alignItems="center" justifyContent="space-between">
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                fontWeight="500"
                color={COLORS.smokyBlack}
              >
                {list.name}
              </Text>
              <Text
                fontSize={13}
                fontWeight="600"
                fontFamily="Mersad_600SemiBold"
                color={COLORS.smokyBlack}
              >
                ${NumberUtils.formatNumber(list.totalBalance, 2)}
              </Text>
            </Row>
            <Spacer value={verticalScale(4)} />
            <Text
              fontSize={12}
              fontWeight="500"
              fontFamily="Inter_500Medium"
              color={COLORS.smokyBlack50}
            >
              {list.accountCount} Addresses
            </Text>
          </View>
        </Row>
      </Button>
    );
  };

  return (
    <FlatList
      data={filteredLists}
      renderItem={renderList}
      keyExtractor={(l) => l.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.searchBar}>
          <InputWithIcon
            value={searchText}
            onChangeValue={setSearchText}
            placeholder="Search collections"
            iconLeft={<SearchIcon color={COLORS.midnight} />}
          />
        </View>
      }
      stickyHeaderIndices={[0]}
    />
  );
};
