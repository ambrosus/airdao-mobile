export interface PasscodeParams {
  title?: string;
  onPasscodeApprove?: () => void;
  onPasscodeApproveWithNavigate?: () => void;
}
