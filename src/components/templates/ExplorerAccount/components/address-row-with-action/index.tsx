import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { DetailsItemTypography } from '@components/base/ExplorerTransactions';
import { Row } from '@components/base';
import { ClipboardIcon } from '@components/svg/icons/v2';
import { Checkmark } from '@components/svg/icons';
import { scale } from '@utils/scaling';

interface AddressRowWithActionProps {
  readonly label: string;
  readonly address: string;
}

const TIMEOUT_TO_RESET_COPIED = 3150;

export const AddressRowWithAction = ({
  label,
  address
}: AddressRowWithActionProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const valueStyle: StyleProp<ViewStyle> = useMemo(() => {
    return { marginTop: 4, maxWidth: scale(311) };
  }, []);

  const onCopyAddress = useCallback(async () => {
    try {
      setIsCopied(true);
      await Clipboard.setStringAsync(address);

      return setTimeout(() => setIsCopied(false), TIMEOUT_TO_RESET_COPIED);
    } catch (error) {
      throw error;
    }
  }, [address]);

  return (
    <View>
      <Row alignItems="center" justifyContent="space-between">
        <DetailsItemTypography>{label}</DetailsItemTypography>

        <Pressable
          onPress={onCopyAddress}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          {!isCopied ? (
            <ClipboardIcon />
          ) : (
            <Checkmark iconColor="#23B083" size={16} />
          )}
        </Pressable>
      </Row>
      <DetailsItemTypography type="value" style={valueStyle}>
        {address}
      </DetailsItemTypography>
    </View>
  );
};
