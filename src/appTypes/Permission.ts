export enum Permission {
  Notifications,
  Camera
}

export type PermissionOptions = {
  requestAgain?: boolean;
  openSettings?: boolean;
};
