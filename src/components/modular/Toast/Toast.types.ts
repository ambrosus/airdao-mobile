export enum ToastPosition {
  Top = 'top',
  Bottom = 'bottom'
}

export interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
  type: ToastPosition;
  onUndo?: () => void;
  onBodyPress?: () => void;
}
