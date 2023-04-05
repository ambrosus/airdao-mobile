export enum PopUpPlacement {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  CENTER = 'center'
}
export interface PopUpInfoProps {
  title: string;
  body: string;
  placement?: PopUpPlacement;
}
