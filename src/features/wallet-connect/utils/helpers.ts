import { ProposalTypes } from '@walletconnect/types';
import { extractChainData } from './presets';

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
