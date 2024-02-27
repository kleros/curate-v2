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

interface IChallengeItemModal {
  toggleModal: () => void;
}

const alertMessage =
  "When you challenge an item a dispute starts. Random jurors are selected to decide if" +
  " the item should be removed or included. In case the challenger wins the deposit is" +
  " reimbursed, in case the challenger loses the deposit is lost. Make sure you read" +
  " and understand the Policy before proceeding.";

const ChallengeItemModal: React.FC<IChallengeItemModal> = ({ toggleModal }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <Header text="Challenge Item" />
        <DepositRequired />
        <Info alertMessage={alertMessage} />
        <Buttons buttonText="Challenge" toggleModal={toggleModal} />
      </ReStyledModal>
    </>
  );
};

export default ChallengeItemModal;
