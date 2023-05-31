export enum Permission {
  Notifications = 'Notifications',
  Camera = 'Camera'
}

export type PermissionOptions = {
  requestAgain?: boolean;
  openSettings?: boolean;
};
