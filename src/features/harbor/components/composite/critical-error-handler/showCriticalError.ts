import { useGlobalErrorStore } from '@entities/global-error/global-error-store';

export function showCriticalError({
  title,
  message
}: {
  title: string;
  message: string;
}) {
  useGlobalErrorStore.getState().setError({ title, message });
}
