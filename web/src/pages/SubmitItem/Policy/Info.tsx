import React from "react";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { AlertMessage } from "@kleros/ui-components-library";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 84vw;
  margin-bottom: 32px;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 618)};
    `
  )}
`;

const alertMessage =
  "The item must follow the Policy. Items that do not follow the policy risk" +
  " being challenged and removed. The deposit required is reimbursed if the item is included, and the" +
  " deposit is lost if the item is removed. Make sure you read and understand the policy before proceeding.";

const Info: React.FC = () => {
  return (
    <Container>
      <AlertMessage variant="info" title="Important" msg={alertMessage} />
    </Container>
  );
};

export default Info;
