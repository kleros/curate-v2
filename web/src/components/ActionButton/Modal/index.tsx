import React from "react";
import { Status } from "consts/status";
import { Address } from "viem";
import ChallengeItemModal, { ChallengeType } from "./ChallengeItemModal";
import RemoveModal from "./RemoveModal";
import ResubmitModal from "./ResubmitModal";

export interface IBaseModal {
  registryAddress: Address;
  itemId: string;
  isItem: boolean;
  toggleModal: () => void;
  refetch: () => void;
}

export const getModalButtonText = (status: Status, isItem?: Boolean) => {
  switch (status) {
    case Status.RegistrationPending:
    case Status.ClearingPending:
      return "Challenge";
    case Status.Included:
      return `Remove ${isItem ? "Item" : "List"}`;
    default:
      return "Resubmit";
  }
};

interface IModal extends IBaseModal {
  status: Status;
}
const Modal: React.FC<IModal> = ({ status, ...props }) => {
  let component: JSX.Element | null = null;
  switch (status) {
    case Status.RegistrationPending:
      component = <ChallengeItemModal {...props} challengeType={ChallengeType.Submission} />;
      break;
    case Status.ClearingPending:
      component = <ChallengeItemModal {...props} challengeType={ChallengeType.Removal} />;
      break;
    case Status.Included:
      component = <RemoveModal {...props} />;
      break;
    default:
      component = <ResubmitModal {...props} />;
  }

  return component;
};

export default Modal;
