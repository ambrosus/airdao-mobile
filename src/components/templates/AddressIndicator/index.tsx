import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useLists } from '@contexts';
import { useWatchlist } from '@hooks';
import { WatchlistIcon } from '@components/svg/icons';
import { StringUtils } from '@utils/string';

interface AddressIndicatorProps {
  address: string;
  hideWatchlist?: boolean;
  hideCollection?: boolean;
}

export function AddressIndicator(props: AddressIndicatorProps): JSX.Element {
  const { address, hideCollection, hideWatchlist } = props;
  const { listsOfAddressGroup } = useLists((v) => v);
  const { watchlist } = useWatchlist();
  const listWithWallet = listsOfAddressGroup.find(
    (list) =>
      list.accounts?.findIndex((account) => account?.address === address) > -1
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
