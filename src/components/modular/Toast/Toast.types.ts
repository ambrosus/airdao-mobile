export enum ToastPosition {
  Top = 'top',
  Bottom = 'bottom'
}

export enum ToastType {
  Highlight,
  Failed,
  Success,
  Information,
  Loading
}

export interface ToastAction {
  label: string;
  onPress: () => unknown;
}

export interface ToastOptions {
  text: string;
  subtext?: string;
  actions?: ToastAction[];
  duration?: number;
  type: ToastType;
  position?: ToastPosition;
  onBodyPress?: () => unknown;
}

export interface ToastRef {
  show: (params: ToastOptions) => void;
  hide: () => void;
}
