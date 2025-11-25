import { AlertMessage, DropdownCascader, NumberField, TextField } from "@kleros/ui-components-library";
import React, { useEffect, useMemo } from "react";
import { rootCourtToItems, useCourtTree } from "hooks/queries/useCourtTree";
import { isEmpty, isUndefined } from "utils/index";
import Skeleton from "react-loading-skeleton";
import ETH from "svgs/icons/eth-round.svg";
import LightButton from "components/LightButton";
import { useSubmitListContext } from "context/SubmitListContext";

import { prepareArbitratorExtradata } from "utils/prepareArbitratorExtradata";
import { formatEther, isAddress } from "viem";
import { KLEROS_ARBITRATOR, KLEROS_GOVERNOR } from "consts/arbitration";
import { useReadKlerosCoreArbitrationCost } from "hooks/contracts/generated";
import clsx from "clsx";

const AbritrationParameters: React.FC = () => {
  const { listData, setListData } = useSubmitListContext();
  const { data } = useCourtTree();
  const items = useMemo(() => !isUndefined(data) && [rootCourtToItems(data.court)], [data]);

  const isGovernorValid = useMemo(
    () => isEmpty(listData.governor) || isAddress(listData.governor),
    [listData.governor]
  );

  const { data: arbitrationCost } = useReadKlerosCoreArbitrationCost({
    args: [prepareArbitratorExtradata(listData.courtId ?? "1", listData.numberOfJurors)],
  });

  useEffect(
    () => setListData({ ...listData, arbitrationCost: formatEther((arbitrationCost as bigint) ?? "") }),
    [arbitrationCost]
  );

  const handleCourtWrite = (courtId: string) => {
    setListData({ ...listData, courtId });
  };

  const handleJurorsWrite = (value: number) => {
    setListData({ ...listData, numberOfJurors: value });
  };

  const noOfVotes = Number.isNaN(listData.numberOfJurors) ? "" : listData.numberOfJurors;
  return (
    <div className="flex flex-col h-max gap-6 lg:min-h-64">
      <div className="flex flex-col gap-1 w-full">
        <div className="flex w-full justify-between">
          <label>Governor</label>
          <LightButton
            className={clsx(
              "border-none p-0",
              "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-sm",
              "hover:[&_.button-text]:text-klerosUIComponentsPrimaryText hover:bg-transparent"
            )}
            text="Select Kleros Governor"
            onClick={() => setListData({ ...listData, governor: KLEROS_GOVERNOR, arbitrator: KLEROS_ARBITRATOR })}
          />
        </div>
        <TextField
          className="w-full"
          placeholder="Governor address"
          value={listData.governor}
          onChange={(value) => setListData({ ...listData, governor: value as `0x${string}` })}
          variant={isGovernorValid ? undefined : "error"}
          message={!isGovernorValid ? "Invalid Address" : ""}
        />
      </div>

      <div className="grid grid-cols-[1fr] gap-4 lg:grid-cols-[1fr_1fr_1fr] lg:items-end">
        {items ? (
          <DropdownCascader
            className="[&_button]:w-full [&_span]:text-klerosUIComponentsSecondaryText"
            label="Select a court"
            items={items}
            callback={(item) => {
              if (typeof item.itemValue === "string") {
                const segments = item.itemValue.split("/");
                const courtId = segments[segments.length - 1];
                if (courtId) handleCourtWrite(courtId);
              }
            }}
            placeholder="Select Court"
            defaultSelectedKey={`/courts/${listData.courtId}`}
            value={`/courts/${listData.courtId}`}
          />
        ) : (
          <Skeleton width={240} height={42} />
        )}

        <NumberField
          className="w-full"
          label="Select the number of jurors"
          placeholder="Number of Jurors"
          minValue={0}
          value={Number(noOfVotes)}
          onChange={handleJurorsWrite}
        />
        <NumberField
          className="w-full"
          label="Arbitration Cost"
          value={arbitrationCost ? Number(formatEther(arbitrationCost as bigint)) : 0}
          Icon={ETH}
          isDisabled
          formatOptions={{
            //Prevent automatic rounding of very small amounts
            minimumFractionDigits: 0,
            maximumFractionDigits: 18,
          }}
        />
      </div>

      <AlertMessage
        className="text-sm [&_svg]:shrink-0"
        variant="info"
        title="Check the courts available beforehand."
        msg="Select a court to arbitrate disputes on this list. Kleros has different courts arbitrating disputes in several areas. Each court has its own purpose and policy. Take some time to choose the best court for your list."
      />
    </div>
  );
};

export default AbritrationParameters;
