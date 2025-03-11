import { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@components/base';
import { WatchlistIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useListsSelector } from '@entities/lists';
import { useWatchlist } from '@hooks';
import { StringUtils } from '@utils';
import { styles } from './styles';

interface AddressIndicatorProps {
  address: string;
  hideWatchlist?: boolean;
  hideCollection?: boolean;
  testID?: string;
}

export function AddressIndicator(props: AddressIndicatorProps): JSX.Element {
  const { address, hideCollection, hideWatchlist } = props;
  const { listsOfAddressGroup } = useListsSelector();
  const { watchlist } = useWatchlist();

  const listWithWallet = useMemo(
    () =>
      listsOfAddressGroup.find(
        (list) =>
          list.accounts?.findIndex((account) => account?.address === address) >
          -1
      ),
    [address, listsOfAddressGroup]
  );
  const isWatchlisted = watchlist.findIndex((a) => a.address === address) > -1;

  if (listWithWallet && !hideCollection) {
    return (
      <View style={styles.container}>
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.gray700}
          numberOfLines={1}
        >
          {StringUtils.formatAddress(listWithWallet.name, 4, 4)}
        </Text>
      </View>
    );
  }
  if (isWatchlisted && !hideWatchlist) {
    return <WatchlistIcon />;
  }
  return <></>;
}
