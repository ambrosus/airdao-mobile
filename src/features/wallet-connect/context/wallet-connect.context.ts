import { useCallback, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { Proposal } from '../types';
import { BottomSheetRef } from '@components/composite';

type ProposalState = Proposal | null;

export const WalletConnectContext = () => {
  const [proposal, setProposal] = useState<ProposalState>(null);

  const approvalConnectionBottomSheetRef = useRef<BottomSheetRef>(null);

  const onChangeProposal = useCallback(
    (_proposal: ProposalState) => setProposal(_proposal),
    []
  );

  return { proposal, onChangeProposal, approvalConnectionBottomSheetRef };
};

export const [WalletConnectContextProvider, useWalletConnectContext] =
  createContextSelector(WalletConnectContext);
