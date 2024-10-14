import { useCallback, useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import {
  CONNECT_VIEW_STEPS,
  Proposal,
  WalletConnectViewValues
} from '../types';
import { BottomSheetRef } from '@components/composite';

type ProposalState = Proposal | null;

export const WalletConnectContext = () => {
  const [isWalletKitInitiated, setIsWalletKitInitiated] = useState(false);
  const [proposal, setProposal] = useState<ProposalState>(null);
  const [walletConnectStep, setWalletConnectStep] =
    useState<WalletConnectViewValues>(CONNECT_VIEW_STEPS.APPROVE);

  const approvalConnectionBottomSheetRef = useRef<BottomSheetRef>(null);

  const onChangeProposal = useCallback(
    (_proposal: ProposalState) => setProposal(_proposal),
    []
  );

  const onChangeConnectModalViewStep = useCallback(
    (step: WalletConnectViewValues) => setWalletConnectStep(step),
    []
  );

  const reset = useCallback(() => {
    onChangeProposal(null);
    onChangeConnectModalViewStep(CONNECT_VIEW_STEPS.APPROVE);
  }, [onChangeConnectModalViewStep, onChangeProposal]);

  return {
    proposal,
    onChangeProposal,
    approvalConnectionBottomSheetRef,
    walletConnectStep,
    setWalletConnectStep,
    onChangeConnectModalViewStep,
    isWalletKitInitiated,
    setIsWalletKitInitiated,
    reset
  };
};

export const [WalletConnectContextProvider, useWalletConnectContext] =
  createContextSelector(WalletConnectContext);
