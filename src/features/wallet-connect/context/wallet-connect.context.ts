import { useCallback, useRef, useState } from 'react';
import { SessionTypes } from '@walletconnect/types';
import { BottomSheetRef } from '@components/composite';
import { createContextSelector } from '@utils';
import {
  CONNECT_VIEW_STEPS,
  Proposal,
  WalletConnectViewValues
} from '../types';

type ProposalState = Proposal | null;

export const WalletConnectContext = () => {
  const [isWalletKitInitiated, setIsWalletKitInitiated] = useState(false);
  const [proposal, setProposal] = useState<ProposalState>(null);
  const [walletConnectStep, setWalletConnectStep] =
    useState<WalletConnectViewValues>(CONNECT_VIEW_STEPS.INITIAL);

  const [activeSessions, setActiveSessions] = useState<SessionTypes.Struct[]>(
    []
  );
  const approvalConnectionBottomSheetRef = useRef<BottomSheetRef>(null);
  const activeSessionsBottomSheetRef = useRef<BottomSheetRef>(null);

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
    activeSessionsBottomSheetRef,
    walletConnectStep,
    setWalletConnectStep,
    onChangeConnectModalViewStep,
    isWalletKitInitiated,
    setIsWalletKitInitiated,
    activeSessions,
    setActiveSessions,
    reset
  };
};

export const [WalletConnectContextProvider, useWalletConnectContext] =
  createContextSelector(WalletConnectContext);
