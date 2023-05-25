export enum ToastType {
  Top = 'top',
  Bottom = 'bottom'
}

export interface ToastOptions {
  title: string;
  message: string;
  duration?: number;
  type: ToastType;
  onUndo?: () => void;
  onBodyPress?: () => void;
}

export type ToastRef = {
  /**
   * Shows Toast
   */
  show: (params: ToastOptions) => void;

  /**
   * Hides Toast
   */
  hide: () => void;
};
