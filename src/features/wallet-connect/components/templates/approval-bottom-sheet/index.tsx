import React, { useCallback, useMemo } from 'react';
import { BottomSheet } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { useWalletConnectContextSelector } from '@features/wallet-connect/lib/hooks';
import {
  EIP155_CHAINS,
  supportedChains,
  walletKit
} from '@features/wallet-connect/utils';
import { EIP155_SIGNING_METHODS } from '@features/wallet-connect/types';
import { buildApprovedNamespaces } from '@walletconnect/utils';
import { useWallet } from '@hooks';
import { PrimaryButton } from '@components/modular';
import { styles } from './styles';
import { View } from 'react-native';

export const ApprovalBottomSheet = () => {
  const { wallet } = useWallet();
  const { approvalConnectionBottomSheetRef, proposal } =
    useWalletConnectContextSelector();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const methods = proposal?.params.optionalNamespaces.eip155?.methods;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const events = proposal?.params.optionalNamespaces.eip155?.events;

  const supportedNamespaces = useMemo(() => {
    const eip155Chains = Object.keys(EIP155_CHAINS).map(
      (chain) => `eip155:${chain}`
    );

    const eip155Methods = Object.values(EIP155_SIGNING_METHODS);

    return {
      eip155: {
        chains: eip155Chains,
        methods: eip155Methods,
        events: ['accountsChanged', 'chainChanged'],
        accounts: eip155Chains
          .map((chain) => `${chain}:${wallet?.address}`)
          .flat()
      }
    };
  }, [wallet?.address]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const chains = useMemo(() => {
    if (!proposal) return [];

    return supportedChains(
      proposal.params.requiredNamespaces,
      proposal.params.optionalNamespaces
    );
  }, [proposal]);

  const onApproveSession = useCallback(async () => {
    if (proposal) {
      const namespaces = buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces
      });

      try {
        await walletKit.approveSession({
          id: proposal.id,
          namespaces
        });
      } catch (error) {
        console.error('Auth error:', error);
      }
    }
  }, [proposal, supportedNamespaces]);

  return (
    <BottomSheet ref={approvalConnectionBottomSheetRef}>
      <View style={styles.container}>
        <Text fontSize={18} color="black" fontFamily="Inter_700Bold">
          Approval
        </Text>

        <PrimaryButton onPress={onApproveSession}>
          <Text color="white" fontFamily="Inter_600SemiBold">
            Approve
          </Text>
        </PrimaryButton>
      </View>
      <Spacer value={24} />
    </BottomSheet>
  );
};
