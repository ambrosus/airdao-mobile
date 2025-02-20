import { MutableRefObject } from 'react';
import {
  BottomSheetOutsideDataProps,
  BottomSheetRef
} from '@components/composite';
interface ModalProps {
  uri: string;
  localRef: MutableRefObject<BottomSheetRef | null>;
  address: string;
  outsideModalData?: BottomSheetOutsideDataProps;
}

export type PersonalSignModalProps = ModalProps;
export type PermissionsModalProps = ModalProps;
