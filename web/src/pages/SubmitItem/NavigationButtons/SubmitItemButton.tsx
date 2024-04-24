import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { EnsureChain } from "components/EnsureChain";
import { useParams } from "react-router-dom";
import { useCurateV2AddItem, usePrepareCurateV2AddItem } from "hooks/contracts/generated";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { wrapWithToast } from "utils/wrapWithToast";
import { isUndefined } from "utils/index";

const StyledButton = styled(Button)``;

const SubmitItemButton: React.FC = () => {
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const publicClient = usePublicClient();

  const { id } = useParams();
  const [listAddress, _]: string[] = id?.split("-");

  const { fields, submissionDeposit } = useSubmitItemContext();

  const { data: config } = usePrepareCurateV2AddItem({
    address: listAddress,
    // enabled: Boolean(fields && submissionDeposit),
    args: [JSON.stringify(fields)],
    value: BigInt(submissionDeposit ?? 0),
  });

  const { writeAsync: submitItem, isLoading } = useCurateV2AddItem(config);

  const isButtonDisabled = useMemo(() => isSubmittingItem, [isSubmittingItem]);

  return (
    <>
      {" "}
      <EnsureChain>
        <StyledButton
          text="Submit Item"
          disabled={isButtonDisabled}
          isLoading={isLoading}
          onClick={() => {
            if (submitItem) {
              setIsSubmittingItem(true);
              wrapWithToast(async () => await submitItem().then((response) => response.hash), publicClient)
                .then((res) => {
                  if (res.status && !isUndefined(res.result)) {
                    console.log({ res });

                    // const id = retrieveDisputeId(res.result.logs[1]);
                    // setDisputeId(Number(id));
                    // setCourtId(disputeData.courtId ?? "1");
                    // setIsPopupOpen(true);
                    // resetDisputeData();
                  }
                })
                .finally(() => {
                  setIsSubmittingItem(false);
                });
            }
          }}
        />
      </EnsureChain>
    </>
  );
};

export default SubmitItemButton;
