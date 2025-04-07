import { WalletKitTypes } from '@reown/walletkit';
import { getSdkError } from '@walletconnect/utils';
import { ethers } from 'ethers';
import Config from '@constants/config';
import {
  PERSONAL_SIGN_MESSAGE,
  formatJsonRpcError,
  formatJsonRpcResult
} from './helpers';

type RequestEventArgs = Omit<
  WalletKitTypes.EventArguments['session_request'],
  'verifyContext'
>;

const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

export async function approveEIP155Request(
  id: number,
  requestEvent: RequestEventArgs,
  privateKey: string
): Promise<any> {
  const { params } = requestEvent;
  const { request } = params;
  try {
    const isPersonalSign =
      typeof request.params[0] === 'string' &&
      request.params[0].startsWith(PERSONAL_SIGN_MESSAGE);

    const wallet = new ethers.Wallet(privateKey, provider);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { gas: _, ...transactionWithoutGas } = request.params[0];

    const connectedWallet = wallet.connect(provider);

    if (isPersonalSign) {
      const message = request.params[0];

      const hash = await connectedWallet.signMessage(
        ethers.utils.isHexString(message)
          ? ethers.utils.arrayify(message)
          : message
      );
      return formatJsonRpcResult(id, hash);
    }

    const { hash } = await connectedWallet.sendTransaction(
      transactionWithoutGas
    );
    return formatJsonRpcResult(id, hash);
  } catch (error: unknown) {
    return formatJsonRpcError(id, (error as { message: string }).message);
  }
}

export function rejectEIP155Request(request: RequestEventArgs) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError('USER_REJECTED').message);
}
