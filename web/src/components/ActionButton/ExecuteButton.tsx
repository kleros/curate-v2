import { Button } from "@kleros/ui-components-library";
import React, { useState } from "react";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { useCurateV2ExecuteRequest, usePrepareCurateV2ExecuteRequest } from "hooks/contracts/generated";
import { wrapWithToast } from "utils/wrapWithToast";
import { EnsureChain } from "../EnsureChain";

interface IExecuteButton {
  registryAddress: Address;
  itemId: string;
  refetch: () => void;
}
const ExecuteButton: React.FC<IExecuteButton> = ({ registryAddress, itemId, refetch }) => {
  const publicClient = usePublicClient();
  const [isExecuting, setIsExecuting] = useState(false);

  const {
    config,
    isError,
    isLoading: isPreparingConfig,
    //@ts-ignore
  } = usePrepareCurateV2ExecuteRequest({ address: registryAddress, args: [itemId as `0x${string}`] });
  const { writeAsync: executeRequest, isLoading } = useCurateV2ExecuteRequest(config);
  return (
    <EnsureChain>
      <Button
        text="Execute"
        disabled={isLoading || isError || isExecuting || isPreparingConfig}
        isLoading={isLoading || isExecuting}
        onClick={() => {
          if (!executeRequest) return;
          setIsExecuting(true);
          wrapWithToast(
            async () =>
              await executeRequest().then((response) => {
                return response.hash;
              }),
            publicClient
          )
            .then(() => refetch())
            .catch(() => {})
            .finally(() => setIsExecuting(false));
        }}
      />
    </EnsureChain>
  );
};

export default ExecuteButton;
