import { useEffect, useState } from 'react';

export const useDelayedMount = (delay = 500) => {
  const [initialMount, setInitialMount] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInitialMount(false);
    }, delay);
  }, [delay]);

  return initialMount;
};
