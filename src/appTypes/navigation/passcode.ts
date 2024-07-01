export interface PasscodeParams {
  title?: string;
  onPasscodeApprove?: () => void | undefined;
  onPasscodeApproveWithNavigate?: () => void | undefined;
}
