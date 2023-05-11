export enum ToastType {
  Top = 'top',
  Bottom = 'bottom'
}

export interface ToastOptions {
  message: string;
  duration?: number;
  type: ToastType;
  onUndo?: () => void;
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
