import React from "react";
import { Card } from "@kleros/ui-components-library";
import { formatETH } from "utils/format";

const FeeRequired: React.FC<{ value: bigint }> = ({ value }) => {
  return (
    <Card className="flex flex-col bg-klerosUIComponentsMediumBlue h-22 w-full border-none justify-center items-center p-4 gap-1.5">
      <p className="text-sm text-klerosUIComponentsPrimaryBlue m-0">Deposit required</p>
      <p className="text-2xl font-semibold text-klerosUIComponentsPrimaryBlue m-0">{formatETH(value ?? 1, 5)} ETH</p>
    </Card>
  );
};

export default FeeRequired;
