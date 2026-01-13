import React from "react";
import { useSubmitListContext } from "context/SubmitListContext";
import { roundSumToPrecision } from "utils/format";
import EthIcon from "svgs/icons/eth-round.svg";
import clsx from "clsx";
import { BigNumberField, NumberField } from "@kleros/ui-components-library";
import WithHelpTooltip from "src/components/WithHelpTooltip";

const ChallengeParameters: React.FC = () => {
  const { listData, setListData } = useSubmitListContext();

  const handleDurationChange = (value: number) => {
    setListData({ ...listData, challengePeriodDuration: value });
  };

  //Use string because that is the defined type and several places expect this to be a string
  const handleDepositChange = (field: string, value: string) => {
    setListData({ ...listData, [field]: value });
  };

  return (
    <div className={clsx("grid grid-cols-[1fr] gap-x-4 gap-y-6 h-max", "lg:grid-cols-[1fr_1fr_1fr] lg:gap-y-3")}>
      <div className="flex flex-col gap-1 w-full">
        <WithHelpTooltip tooltipMsg="The length of time (in hours) that a submission can be challenged before it is automatically accepted onto the list and the submitter's deposit is refunded.">
          <label>Challenge period duration (hours)</label>
        </WithHelpTooltip>
        <NumberField
          className="w-full"
          aria-label="Challenge period duration (hours)"
          placeholder="hours"
          name="challengePeriodDuration"
          minValue={0}
          value={listData.challengePeriodDuration}
          onChange={(value) => handleDurationChange(value)}
          formatOptions={{
            maximumFractionDigits: 2,
          }}
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <WithHelpTooltip tooltipMsg="This is the deposit required to submit an item to the list and also the amount awarded to successful challengers. If the value is too low, challengers may not have enough incentive to look for flaws in the submissions and bad ones could make it through. If it is too high, submitters may not have enough incentive to send items which may result in an empty list.">
          <label>Submission challenge bounty</label>
        </WithHelpTooltip>
        <BigNumberField
          className="w-full"
          aria-label="Submission challenge bounty"
          placeholder="84"
          name="submissionChallengeBaseDeposit"
          minValue="0"
          value={listData.submissionChallengeBaseDeposit}
          onChange={(value) => handleDepositChange("submissionChallengeBaseDeposit", value.toString())}
          Icon={EthIcon}
        />
        <WithHelpTooltip tooltipMsg="The total cost is the sum of the base deposit and the arbitration cost.">
          <label>
            Total:{" "}
            {roundSumToPrecision(listData.arbitrationCost ?? "0", listData.submissionChallengeBaseDeposit ?? "0")} ETH
          </label>
        </WithHelpTooltip>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <WithHelpTooltip tooltipMsg="This is the deposit required to remove an item and also the amount awarded to successful challengers. If the value is too low, people will not have enough incentive to look for flaws in removal requests and compliant items could be removed from the list. If it is too high, people will be afraid to remove items so a non compliant submission could stay longer than it should.">
          <label>Removal challenge bounty</label>
        </WithHelpTooltip>
        <BigNumberField
          className="w-full"
          aria-label="Removal challenge bounty"
          placeholder="84"
          name="removalChallengeBaseDeposit"
          value={listData.removalChallengeBaseDeposit}
          onChange={(value) => handleDepositChange("removalChallengeBaseDeposit", value.toString())}
          Icon={EthIcon}
          minValue="0"
        />
        <WithHelpTooltip tooltipMsg="The total cost is the sum of the base deposit and the arbitration cost.">
          <label>
            Total: {roundSumToPrecision(listData.arbitrationCost ?? "0", listData.removalChallengeBaseDeposit ?? "0")}{" "}
            ETH
          </label>
        </WithHelpTooltip>
      </div>
    </div>
  );
};

export default ChallengeParameters;
