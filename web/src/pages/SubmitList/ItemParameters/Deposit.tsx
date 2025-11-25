import React from "react";
import NavigationButtons from "../NavigationButtons";
import { Slider } from "@kleros/ui-components-library";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { parseEther } from "viem";
import { formatETH } from "utils/format";
import { cn } from "src/utils";
import { BASE_CONTAINER_LANDSCAPE_WIDTH_CALC, BASE_CONTAINER_STYLE } from "../constants";

const depositContainerStyle = "flex flex-col gap-8 w-full";
const sliderContainerStyle = "w-full p-4";
const labelStyle = "w-full text-base font-normal";

const Deposit: React.FC = () => {
  const { listData, setListData } = useSubmitListContext();

  return (
    <div className={cn(BASE_CONTAINER_STYLE, BASE_CONTAINER_LANDSCAPE_WIDTH_CALC)}>
      <div className="flex flex-col gap-12 w-full">
        <div className={cn(depositContainerStyle)}>
          <Header text="Item Deposit" />
          <label className={cn(labelStyle)}>
            Item deposit is the value users need to deposit to submit a new item to the list. The deposit is sufficient
            to cover the costs involving a dispute, in case someone challenges the item. Note that, if the deposit is
            too low users may be less interested in challenging incorrect items, resulting in low-quality items included
            on the list. On the other hand, if the deposit is too high, users will rarely submit new items. Balance is
            key.
          </label>
          <div className={cn(sliderContainerStyle)}>
            <Slider
              className="w-full"
              callback={(val) => setListData({ ...listData, submissionBaseDeposit: formatETH(BigInt(val), 5) })}
              minValue={parseEthToNumber("0.00001")}
              maxValue={parseEthToNumber("0.01")}
              leftLabel="0.00001 ETH"
              rightLabel="0.01 ETH"
              formatter={(val) => `${formatETH(BigInt(val), 5)} ETH`}
              value={parseEthToNumber(listData.submissionBaseDeposit)}
            />
          </div>
        </div>
        <div className={cn(depositContainerStyle)}>
          <Header text="Removal Base Deposit" />
          <label className={cn(labelStyle)}>
            Removal base deposit is the value users need to deposit in order to remove an item.
          </label>
          <div className={cn(sliderContainerStyle)}>
            <Slider
              className="w-full"
              callback={(val) => setListData({ ...listData, removalBaseDeposit: formatETH(BigInt(val), 5) })}
              minValue={parseEthToNumber("0.00001")}
              maxValue={parseEthToNumber("0.01")}
              leftLabel="0.00001 ETH"
              rightLabel="0.01 ETH"
              formatter={(val) => `${formatETH(BigInt(val), 5)} ETH`}
              value={parseEthToNumber(listData.removalBaseDeposit)}
            />
          </div>
        </div>
      </div>

      <NavigationButtons prevRoute="/submit-list/policy" nextRoute="/submit-list/fields" />
    </div>
  );
};

const parseEthToNumber = (val: string) => Number(parseEther(val));

export default Deposit;
