import { Proposal } from '@features/wallet-connect/types';

type RequiredNamespacesWithRpcMap = Proposal & {
  eip155: {
    chains: string[];
    rpcMap: Record<number, string>;
  };
};

export function useExtractProposalData(proposal: Proposal | null) {
  if (!proposal)
    return {
      verifyUrl: '',
      isScam: false,
      chains: [],
      rpcMap: {},
      origin: ''
    };

  const {
    verified: { verifyUrl, isScam, origin }
  } = proposal.verifyContext;

  const {
    eip155: { chains, rpcMap }
  } = proposal.params
    .requiredNamespaces as unknown as RequiredNamespacesWithRpcMap;

  return {
    verifyUrl,
    isScam,
    chains,
    rpcMap,
    origin
  };
}
