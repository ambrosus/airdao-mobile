import React from 'react';
import {
  CONNECT_VIEW_STEPS,
  WalletConnectViewValues
} from '@features/wallet-connect/types';
import {
  WalletConnectApprovalView,
  WalletConnectionFailedView,
  WalletConnectionWrongChainView
} from '../../composite';

export function renderModalViewByStep(step: WalletConnectViewValues) {
  switch (step) {
    case CONNECT_VIEW_STEPS.APPROVE: {
      return <WalletConnectApprovalView />;
    }
    case CONNECT_VIEW_STEPS.CONNECT_ERROR:
    case CONNECT_VIEW_STEPS.PAIR_EXPIRED_ERROR: {
      return <WalletConnectionFailedView />;
    }
    case CONNECT_VIEW_STEPS.WRONG_CHAIN_ERROR: {
      return <WalletConnectionWrongChainView />;
    }
    case CONNECT_VIEW_STEPS.INITIAL: {
      return null;
    }
  }
}
