import React, { useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { EnsureChain } from "components/EnsureChain";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { wrapWithToast } from "utils/wrapWithToast";
import { isUndefined } from "utils/index";
import { Log, decodeEventLog, parseAbi } from "viem";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { useNavigate } from "react-router-dom";
import { useSimulateCurateV2AddItem, useWriteCurateV2AddItem } from "hooks/useContract";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import { ErrorButtonMessage } from "components/ActionButton/Modal/Buttons/ErrorButtonMessage";

const SubmitItemButton: React.FC = () => {
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const navigate = useNavigate();

  const { fields, submissionDeposit, resetItemData } = useSubmitItemContext();
  const { id: registryAddress } = useRegistryDetailsContext();

  const { data: userBalance, isLoading: isBalanceLoading } = useBalance({ address });

  const insufficientBalance = useMemo(() => {
    if (isUndefined(userBalance) || !submissionDeposit) return true;
    return userBalance.value < BigInt(submissionDeposit);
  }, [userBalance, submissionDeposit]);

  const {
    data: config,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useSimulateCurateV2AddItem({
    query: {
      enabled: Boolean(fields && submissionDeposit && registryAddress && !insufficientBalance),
    },
    address: registryAddress as `0x${string}`,
    args: [JSON.stringify(fields)],
    value: BigInt(submissionDeposit ?? 0),
  });

  const { writeContractAsync: submitItem } = useWriteCurateV2AddItem();

  const isButtonDisabled = useMemo(
    () => isSubmittingItem || isConfigLoading || isConfigError || insufficientBalance || isBalanceLoading,
    [isSubmittingItem, isConfigLoading, isConfigError, insufficientBalance, isBalanceLoading]
  );

  return (
    <EnsureChain>
      <div>
        <Button
          text="Submit Item"
          isDisabled={isButtonDisabled}
          isLoading={(isConfigLoading && !insufficientBalance) || isSubmittingItem || isBalanceLoading}
          onPress={() => {
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
        {insufficientBalance ? (
          <ErrorButtonMessage>
            <ClosedCircleIcon /> Insufficient balance
          </ErrorButtonMessage>
        ) : null}
      </div>
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
