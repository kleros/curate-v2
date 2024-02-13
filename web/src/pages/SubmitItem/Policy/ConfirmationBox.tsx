import React from "react";
import styled from "styled-components";
import { Checkbox } from "@kleros/ui-components-library";
import { useSubmitItemContext } from "context/SubmitItemContext";

const Container = styled.div`
  margin-bottom: 32px;
`;

interface IConfirmationBox {}

const ConfirmationBox: React.FC<IConfirmationBox> = ({}) => {
  const { isPolicyRead, setIsPolicyRead } = useSubmitItemContext();

  return (
    <Container>
      <Checkbox
        label="I certify that I read and understand the Policy "
        checked={isPolicyRead}
        small
        onChange={() => setIsPolicyRead(!isPolicyRead)}
      />
    </Container>
  );
};

export default ConfirmationBox;
