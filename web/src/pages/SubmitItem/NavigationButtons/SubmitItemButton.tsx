import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { EnsureChain } from "components/EnsureChain";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { wrapWithToast } from "utils/wrapWithToast";
import { isUndefined } from "utils/index";
import { Log, decodeEventLog, parseAbi } from "viem";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { useNavigate } from "react-router-dom";
import { useSimulateCurateV2AddItem, useWriteCurateV2AddItem } from "hooks/useContract";

const StyledButton = styled(Button)``;

const SubmitItemButton: React.FC = () => {
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const publicClient = usePublicClient();
  const navigate = useNavigate();

  const { fields, submissionDeposit, resetItemData } = useSubmitItemContext();
  const { id: registryAddress } = useRegistryDetailsContext();

  const { data: config } = useSimulateCurateV2AddItem({
    query: {
      enabled: Boolean(fields && submissionDeposit && registryAddress),
    },
    address: registryAddress as `0x${string}`,
    args: [JSON.stringify(fields)],
    value: BigInt(submissionDeposit ?? 0),
  });

  const { writeContractAsync: submitItem, isLoading } = useWriteCurateV2AddItem();

  const isButtonDisabled = useMemo(() => isSubmittingItem, [isSubmittingItem]);

  return (
    <EnsureChain>
      <StyledButton
        text="Submit Item"
        disabled={isButtonDisabled}
        isLoading={isLoading}
        onClick={() => {
          if (submitItem && publicClient && config) {
            setIsSubmittingItem(true);
            wrapWithToast(async () => await submitItem(config?.request), publicClient)
              .then((res) => {
                if (res.status && !isUndefined(res.result)) {
                  const itemId = retrieveItemId(res.result.logs[0]);
                  resetItemData();
                  navigate(`/lists/item/${itemId}@${registryAddress}`);
                }
              })
              .finally(() => {
                setIsSubmittingItem(false);
              });
          }
        }}
      />
    </EnsureChain>
  );
};

export const retrieveItemId = (eventLog: Log) =>
  decodeEventLog({
    abi: parseAbi(["event NewItem(bytes32 indexed _itemID, string _data, bool _addedDirectly)"]),
    data: eventLog.data,
    topics: eventLog.topics,
  }).args._itemID;

export default SubmitItemButton;
