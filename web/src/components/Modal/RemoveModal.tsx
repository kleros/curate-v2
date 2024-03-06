import React, { useRef } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import { Overlay } from "components/Overlay";
import Header from "./Header";
import Buttons from "./Buttons";
import DepositRequired from "./DepositRequired";
import { StyledModal } from "./StyledModal";
import Info from "./Info";

const ReStyledModal = styled(StyledModal)`
  gap: 32px;
`;

interface IRemoveModal {
  toggleModal: () => void;
  isItem: boolean;
}

const alertMessage = (isItem: boolean) =>
  `When you request ${isItem ? "an item" : "a list"} to be removed it goes to the Pending state for a while.` +
  ` During that time the removal can be challenged starting a dispute. If the ${isItem ? "item" : "list"} is` +
  ` removed the deposit is reimbursed, in case the ${isItem ? "item" : "list"} is not removed the deposit is lost.` +
  ` Make sure you read and understand the Policy before proceeding.`;

const RemoveModal: React.FC<IRemoveModal> = ({ toggleModal, isItem }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <Header text={`Remove ${isItem ? "Item" : "List"}`} />
        <DepositRequired />
        <Info alertMessage={alertMessage(isItem)} />
        <Buttons buttonText="Remove" toggleModal={toggleModal} />
      </ReStyledModal>
    </>
  );
};

export default RemoveModal;
