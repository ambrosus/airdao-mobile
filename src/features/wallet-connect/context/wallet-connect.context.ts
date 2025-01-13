import { useCallback, useRef, useState } from 'react';
import { SessionTypes } from '@walletconnect/types';
import { BottomSheetRef } from '@components/composite';
import { createContextSelector } from '@utils';
import {
  CONNECT_VIEW_STEPS,
  DecodedTransaction,
  DecodedTransactionState,
  Proposal,
  SessionRequestEvent,
  WalletConnectViewValues
} from '../types';

type ProposalState = Proposal | null;
type RequestState = {
  event: SessionRequestEvent;
  session: SessionTypes.Struct;
} | null;

export const WalletConnectContext = () => {
  const [isWalletKitInitiated, setIsWalletKitInitiated] = useState(false);
  const [proposal, setProposal] = useState<ProposalState>(null);
  const [request, setRequest] = useState<RequestState>(null);
  const [transaction, setTransaction] = useState<DecodedTransactionState>(null);
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

  const onChangeRequest = useCallback(
    (_request: RequestState) => setRequest(_request),
    []
  );

  const onChangeConnectModalViewStep = useCallback(
    (step: WalletConnectViewValues) => setWalletConnectStep(step),
    []
  );

  const onChangeTransactionData = useCallback(
    (data: DecodedTransaction | null) => setTransaction(data),
    []
  );

  const reset = useCallback(() => {
    onChangeProposal(null);
    onChangeRequest(null);
    onChangeTransactionData(null);
    onChangeConnectModalViewStep(CONNECT_VIEW_STEPS.APPROVE);
  }, [
    onChangeConnectModalViewStep,
    onChangeProposal,
    onChangeRequest,
    onChangeTransactionData
  ]);

  return {
    proposal,
    onChangeProposal,
    approvalConnectionBottomSheetRef,
    activeSessionsBottomSheetRef,
    walletConnectStep,
    setWalletConnectStep,
    request,
    onChangeRequest,
    transaction,
    onChangeTransactionData,
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
