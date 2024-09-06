import { Button } from "@kleros/ui-components-library";
import React, { useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { wrapWithToast } from "utils/wrapWithToast";
import { EnsureChain } from "../EnsureChain";
import { useSimulateCurateV2ExecuteRequest, useWriteCurateV2ExecuteRequest } from "hooks/useContract";

interface IExecuteButton {
  registryAddress: Address;
  itemId: string;
  refetch: () => void;
  disabled?: boolean;
}
const ExecuteButton: React.FC<IExecuteButton> = ({ registryAddress, itemId, refetch, disabled }) => {
  const publicClient = usePublicClient();
  const [isExecuting, setIsExecuting] = useState(false);

  const {
    data: config,
    isError,
    isLoading: isPreparingConfig,
  } = useSimulateCurateV2ExecuteRequest({ address: registryAddress, args: [itemId as `0x${string}`] });
  const { writeContractAsync: executeRequest, isLoading } = useWriteCurateV2ExecuteRequest();
  return (
    <EnsureChain>
      <Button
        text="Execute"
        disabled={isLoading || isError || isExecuting || isPreparingConfig || disabled}
        isLoading={isLoading || isExecuting}
        onClick={() => {
          if (!executeRequest || !config || !publicClient) return;
          setIsExecuting(true);
          wrapWithToast(async () => await executeRequest(config.request), publicClient)
            .then(() => refetch())
            .catch(() => {})
            .finally(() => setIsExecuting(false));
        }}
      />
    </EnsureChain>
  );
};

export default ExecuteButton;
