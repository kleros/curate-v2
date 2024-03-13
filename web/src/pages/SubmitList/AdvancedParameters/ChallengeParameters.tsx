import React from "react";
import styled, { css } from "styled-components";
import LabeledInput from "components/LabeledInput";
import { landscapeStyle } from "styles/landscapeStyle";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 24px;
  column-gap: 16px;
  height: max-content;
  ${landscapeStyle(
    () => css`
      grid-template-columns: 1fr 1fr 1fr;
      row-gap: 12;
    `
  )}
`;
const ChallengeParameters: React.FC = () => {
  return (
    <Container>
      <LabeledInput topLeftLabel="Challenge period duration (hours)" placeholder="84" />
      <LabeledInput
        topLeftLabel="Submission challenge bounty"
        bottomLeftLabel="Total : 0.086 ETH"
        bottomLeftMsg=""
        placeholder="84"
        variant="currency"
      />
      <LabeledInput
        topLeftLabel="Removal challenge bounty"
        placeholder="84"
        bottomLeftLabel="Total : 0.086 ETH"
        bottomLeftMsg=""
      />
      <LabeledInput
        topLeftLabel="Incorrect challenge compensation"
        placeholder="84"
        bottomLeftLabel="Total : 0.086 ETH"
        bottomLeftMsg=""
      />
      <LabeledInput
        topLeftLabel="Incorrect removal challenge compensation"
        placeholder="84"
        bottomLeftLabel="Total : 0.086 ETH"
        bottomLeftMsg="a"
      />
    </Container>
  );
};

export default ChallengeParameters;
