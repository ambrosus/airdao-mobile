import {
  CONNECT_VIEW_STEPS,
  WalletConnectViewValues
} from '@features/wallet-connect/types';
import {
  WalletConnectApprovalView,
  WalletConnectTxApproval,
  WalletConnectionFailedView,
  WalletConnectionWrongChainView
} from '../../composite';

export function RenderModalViewByStep(step: WalletConnectViewValues) {
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
    case CONNECT_VIEW_STEPS.EIP155_TRANSACTION: {
      return <WalletConnectTxApproval />;
    }
    case CONNECT_VIEW_STEPS.INITIAL: {
      return null;
    }
  }
}
