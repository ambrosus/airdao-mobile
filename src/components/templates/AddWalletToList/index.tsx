import React, { useMemo, useState } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { InputWithIcon } from '@components/composite';
import { scale, verticalScale } from '@utils/scaling';
import { styles } from './styles';
import { ExplorerAccount } from '@models/Explorer';
import { AccountList } from '@models/AccountList';
import { COLORS } from '@constants/colors';
import { SearchIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { useLists } from '@contexts/ListsContext';
import { useTranslation } from 'react-i18next';

export interface AddWalletToListProps {
  wallet: ExplorerAccount;
  lists: AccountList[];
  onWalletMove?: (newList: AccountList) => unknown;
}

export const AddWalletToList = (props: AddWalletToListProps): JSX.Element => {
  const { wallet, lists, onWalletMove } = props;
  const { toggleAddressesInList } = useLists((v) => v);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const filteredLists = useMemo(
    () =>
      searchText ? lists.filter((l) => l.name.includes(searchText)) : lists,
    [lists, searchText]
  );

  const toggleWalletInList = (list: AccountList) => {
    if (typeof onWalletMove === 'function') onWalletMove(list);
    setTimeout(() => {
      toggleAddressesInList([wallet], list);
    }, 750);
  };

  const renderList = (args: ListRenderItemInfo<AccountList>) => {
    const { item: list } = args;
    const onPress = () => {
      toggleWalletInList(list);
    };

    return (
      <Button
        onPress={onPress}
        testID="AddWalletToList_Container"
        style={styles.item}
      >
        <Row alignItems="center" justifyContent="space-between">
          <View style={{ flex: 1 }}>
            <Row alignItems="center" justifyContent="space-between">
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                fontWeight="500"
                color={COLORS.neutral900}
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {list.name}
              </Text>
              <Spacer horizontal value={scale(24)} />
              <Text
                fontSize={13}
                fontWeight="600"
                fontFamily="Mersad_600SemiBold"
                color={COLORS.neutral900}
              >
                ${NumberUtils.formatNumber(list.totalBalance, 2)}
              </Text>
            </Row>
            <Spacer value={verticalScale(4)} />
            <Text
              fontSize={12}
              fontWeight="500"
              fontFamily="Inter_500Medium"
              color={COLORS.alphaBlack50}
            >
              {list.accountCount} {t('addresses')}
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
            placeholder={t('collection.search.input')}
            iconLeft={<SearchIcon color={COLORS.midnight} />}
          />
        </View>
      }
      stickyHeaderIndices={[0]}
    />
  );
};
