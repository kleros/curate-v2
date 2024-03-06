import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
// import ChallengeButton from "components/ChallengeButton";
// import RemoveButton from "components/RemoveButton";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

interface IButtons {
  toggleModal: () => void;
  buttonText: string;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, buttonText }) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onClick={toggleModal} />
      <Button text={buttonText} toggleModal={toggleModal} />
      {/* <ChallengeButton buttonText={buttonText} toggleModal={toggleModal} /> */}
      {/* <RemoveButton buttonText={buttonText} toggleModal={toggleModal} /> */}
    </Container>
  );
};
export default Buttons;
