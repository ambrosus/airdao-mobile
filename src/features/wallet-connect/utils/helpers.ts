import { ProposalTypes } from '@walletconnect/types';
import { ethers } from 'ethers';
import { extractChainData } from './presets';
import { walletKit } from '../lib/wc.core';

export function supportedChains(
  requiredNamespaces: ProposalTypes.RequiredNamespaces,
  optionalNamespaces: ProposalTypes.OptionalNamespaces
) {
  if (!requiredNamespaces && !optionalNamespaces) {
    return [];
  }

  const required = [];
  const optional = [];

  for (const [key, values] of Object.entries(requiredNamespaces)) {
    const chains = key.includes(':') ? key : values.chains;

    if (chains) {
      required.push(chains);
    }
  }

  for (const [key, values] of Object.entries(optionalNamespaces)) {
    const chains = key.includes(':') ? key : values.chains;

    if (chains) {
      optional.push(chains);
    }
  }

  const chains = [...required.flat(), ...optional.flat()];

  return chains
    .map((chain) => extractChainData(chain.split(':')[1]))
    .filter((chain) => chain !== undefined);
}

export function formatJsonRpcResult(id: number, result: string) {
  if (typeof id !== 'number' || id <= 0) {
    throw new Error('Invalid JSON-RPC request ID.');
  }

  return {
    jsonrpc: '2.0',
    id,
    result
  };
}

export function convertHexToUtf8(value: string) {
  if (ethers.utils.isHexString(value)) {
    return ethers.utils.toUtf8String(value);
  }

  return value;
}

export function getSignParamsMessage(params: string[]) {
  const message = params.filter((p) => !ethers.utils.isAddress(p))[0];

  return convertHexToUtf8(message);
}

export function formatJsonRpcError(id: number, message: string) {
  if (typeof message !== 'string') {
    throw new Error('Invalid code or message provided.');
  }

  const error = {
    message
  };

  return {
    jsonrpc: '2.0',
    id: id === undefined ? null : id, // Use null if id is not provided
    error
  };
}

export function httpsParser(url: string) {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  } catch (error) {
    throw new Error('Invalid URL provided.');
  }
}

export const validateAndFilterSessions = async (sessions: any[]) => {
  const validSessions = [];

  for (const session of sessions) {
    try {
      await walletKit.engine.signClient.ping({ topic: session.topic });
      validSessions.push(session);
    } catch (error) {
      try {
        await walletKit.engine.signClient.disconnect({
          topic: session.topic,
          reason: { code: 6000, message: 'Session is invalid' }
        });
      } catch (cleanupError) {
        console.error('Error cleaning up invalid session:', cleanupError);
      }
    }
  }

  return validSessions;
};
