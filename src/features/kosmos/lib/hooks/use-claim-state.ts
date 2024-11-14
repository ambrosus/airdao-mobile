import { useState } from 'react';

export function useClaimState() {
  const [claimingTransaction, setClaimingTransaction] = useState(false);
  return { claimingTransaction, setClaimingTransaction };
}
