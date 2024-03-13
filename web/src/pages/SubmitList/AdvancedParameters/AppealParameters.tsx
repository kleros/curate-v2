import { AlertMessage } from "@kleros/ui-components-library";
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
const AlertMessageContainer = styled.div`
  grid-column: span 3;
  svg {
    flex-shrink: 0;
  }
  small {
    white-space: pre-line;
  }
`;
const AppealParameters: React.FC = () => {
  return (
    <Container>
      <LabeledInput topLeftLabel="Shared stake multiplier" placeholder="100" />
      <LabeledInput topLeftLabel="Winner stake multiplier" placeholder="100" />
      <LabeledInput topLeftLabel="Loser stake multiplier" placeholder="200" />
      <AlertMessageContainer>
        <AlertMessage
          variant="info"
          title="Appeal Parameters"
          msg={
            "To appeal, in addition to paying enough fees to cover the payment to the juros in case the appeal is lost, parties must also pay an additional stake. The stake of the side that ultimately loses the dispute is used as the reward given to the appeal fee contributors that funded the side that ultimately wins the dispute.\n\nThis amount is calculated proportionally to the total juror fees required for appeal using the multipliers below, given in percentage. For example, a multiplier of 10% will result in the stake being 10% of the total juror fees.\n\nIf you choose very large stake multipliers, the expected returns of crowdfunders will improve, but appeal costs may become so large as to be a barrier. If you choose very small stake multipliers, total appeal costs are reduced, but crowdfunders may not be sufficiently incentivized to participate. Different multipliers can be chosen for the sides that won and lost the previous appeal round. the more one of these multipliers is larger than other, the more the side with the smaller multiplier is favoured.\n\nThe total cost to fully fund one side of an appeal is: Total Appeal Cost=Total Juror Fees+Total Juror Fees*Stake Multiplier"
          }
        />
      </AlertMessageContainer>
    </Container>
  );
};

export default AppealParameters;
