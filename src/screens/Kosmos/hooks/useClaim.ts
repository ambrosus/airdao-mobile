import { useState } from 'react';

export const useClaim = () => {
  const [claimingTransaction, setClamingTransaction] = useState(false);
  return { claimingTransaction, setClamingTransaction };
};
