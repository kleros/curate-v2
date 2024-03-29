import React from "react";
import styled, { css } from "styled-components";
import LabeledInput from "components/LabeledInput";
import { landscapeStyle } from "styles/landscapeStyle";
import { useSubmitListContext } from "context/SubmitListContext";
import { roundSumToPrecision } from "utils/format";

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
  const { listData, setListData } = useSubmitListContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9.]/g, "");

    setListData({ ...listData, [event.target.name]: value });
  };

  return (
    <Container>
      <LabeledInput
        topLeftLabel={{
          text: "Challenge period duration (hours)",
          tooltipMsg:
            "The length of time (in hours) that a submission can be challenged before it is automatically accepted onto the list and the submitter's deposit is refunded.",
        }}
        placeholder="hours"
        name="challengePeriodDuration"
        value={listData.challengePeriodDuration}
        onChange={handleChange}
      />
      <LabeledInput
        topLeftLabel={{
          text: "Submission challenge bounty",
          tooltipMsg:
            "This is the deposit required to submit an item to the list and also the amount awarded to successful challengers. If the value is too low, challengers may not have enough incentive to look for flaws in the submissions and bad ones could make it through. If it is too high, submitters may not have enough incentive to send items which may result in an empty list.",
        }}
        bottomLeftLabel={{
          text: `Total : ${roundSumToPrecision(
            Number(listData.arbitrationCost),
            Number(listData.submissionChallengeBaseDeposit)
          )} ETH`,
          tooltipMsg: "The total cost is the sum of the base deposit and the arbitration cost.",
        }}
        placeholder="84"
        variant="currency"
        name="submissionChallengeBaseDeposit"
        value={listData.submissionChallengeBaseDeposit}
        onChange={handleChange}
      />
      <LabeledInput
        topLeftLabel={{
          text: "Removal challenge bounty",
          tooltipMsg:
            "This is the deposit required to remove an item and also the amount awarded to successful challengers. If the value is too low, people will not have enough incentive to look for flaws in removal requests and compliant items could be removed from the list. If it is too high, people will be afraid to remove items so a non compliant submission could stay longer than it should.",
        }}
        bottomLeftLabel={{
          text: `Total : ${roundSumToPrecision(
            Number(listData.arbitrationCost),
            Number(listData.removalChallengeBaseDeposit)
          )} ETH`,
          tooltipMsg: "The total cost is the sum of the base deposit and the arbitration cost.",
        }}
        placeholder="84"
        name="removalChallengeBaseDeposit"
        value={listData.removalChallengeBaseDeposit}
        onChange={handleChange}
      />
    </Container>
  );
};

export default ChallengeParameters;
