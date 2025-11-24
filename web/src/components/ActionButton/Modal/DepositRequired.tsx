import React from "react";
import { Card } from "@kleros/ui-components-library";
import { formatETH } from "utils/format";
import clsx from "clsx";

const FeeRequired: React.FC<{ value: bigint }> = ({ value }) => {
  return (
    <Card
      className={clsx(
        "flex flex-col gap-1.5",
        "w-full h-22 p-4 justify-center items-center",
        "bg-klerosUIComponentsMediumBlue border-none"
      )}
    >
      <p className="text-sm text-klerosUIComponentsPrimaryBlue">Deposit required</p>
      <p className="text-2xl font-semibold text-klerosUIComponentsPrimaryBlue">{formatETH(value ?? 1, 5)} ETH</p>
    </Card>
  );
};

export default FeeRequired;
