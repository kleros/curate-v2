import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { EnsureChain } from "components/EnsureChain";
import { EnsureAuth } from "components/EnsureAuth";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import { ErrorButtonMessage } from "./ErrorButtonMessage";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface IButtons {
  toggleModal: () => void;
  callback: () => void;
  buttonText: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  insufficientBalance: boolean;
}

const Buttons: React.FC<IButtons> = ({
  toggleModal,
  buttonText,
  callback,
  isLoading,
  isDisabled,
  insufficientBalance,
}) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onClick={toggleModal} />
      <EnsureChain>
        <EnsureAuth>
          <ButtonsContainer>
            <Button
              text={buttonText}
              onClick={() => {
                callback();
              }}
              isLoading={isLoading}
              disabled={isDisabled}
            />
            {insufficientBalance ? (
              <ErrorButtonMessage>
                <ClosedCircleIcon /> Insufficient balance
              </ErrorButtonMessage>
            ) : null}
          </ButtonsContainer>
        </EnsureAuth>
      </EnsureChain>
    </Container>
  );
};
export default Buttons;
