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
