import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { EnsureChain } from "components/EnsureChain";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

interface IButtons {
  toggleModal: () => void;
  callback: () => void;
  buttonText: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, buttonText, callback, isLoading, isDisabled }) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onClick={toggleModal} />
      <EnsureChain>
        <Button
          text={buttonText}
          onClick={() => {
            callback();
          }}
          isLoading={isLoading}
          disabled={isDisabled}
        />
      </EnsureChain>
    </Container>
  );
};
export default Buttons;
