import React from "react";
import styled from "styled-components";
import WithHelpTooltip from "components/WithHelpTooltip";
import TruncatedText from "components/TruncatedText";
import { Overlay } from "components/Overlay";
import { Textarea } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import Modal from "components/Modal";

const Container = styled.p`
  margin: 0px;
`;

const StyledModal = styled(Modal)`
  padding: 0;
`;

const TextDisplay = styled(Textarea)`
  width: 100%;
  height: 80vh;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryBlue};
  cursor: pointer;
`;

const LongTextFullDisplay: React.FC<{ text: string; toggleModal: () => void }> = ({ text, toggleModal }) => (
  <>
    <Overlay />
    <StyledModal {...{ toggleModal }}>
      <TextDisplay value={text} disabled />
    </StyledModal>
  </>
);

export interface ILongTextField {
  value: string;
  detailed?: boolean;
  label?: string;
}

const LongTextField: React.FC<ILongTextField> = ({ value, detailed, label }) => {
  const [isModalOpen, toggleModal] = useToggle(false);
  return (
    <>
      <Container>
        {detailed ? (
          <WithHelpTooltip tooltipMsg={label ?? ""}>
            <TruncatedText text={value} maxLength={40} />
            &nbsp; <StyledLabel onClick={toggleModal}>[Read More]</StyledLabel>
          </WithHelpTooltip>
        ) : (
          <TruncatedText text={value} maxLength={30} />
        )}
      </Container>
      {isModalOpen && <LongTextFullDisplay text={value} toggleModal={toggleModal} />}
    </>
  );
};

export default LongTextField;
