export enum PopUpPlacement {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  CENTER = 'center'
}
export interface PopUpInfoProps {
  testID?: string;
  title: string;
  body: string;
  placement?: PopUpPlacement;
  isVisible?: boolean;
  onInfoPress?: () => void;
  onBackdropPress?: () => void;
}
