import React from "react";
import styled from "styled-components";
import { AlertMessage } from "@kleros/ui-components-library";

const Container = styled.div`
  display: flex;
  width: 100%;
`;

interface IInfo {
  alertMessage: string;
}

const Info: React.FC<IInfo> = ({ alertMessage }) => {
  return (
    <Container>
      <AlertMessage variant="info" title="Important" msg={alertMessage} />
    </Container>
  );
};

export default Info;
