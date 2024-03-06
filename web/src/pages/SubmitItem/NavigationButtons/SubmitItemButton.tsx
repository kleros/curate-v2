import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { EnsureChain } from "components/EnsureChain";

const StyledButton = styled(Button)``;

const SubmitItemButton: React.FC = () => {
  const publicClient = usePublicClient();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // const { fieldOne } =
  //   useSubmitItemContext();

  // const { config: submitCaseConfig } = usePrepareDisputeResolverCreateDisputeForTemplate({
  //   enabled: isTemplateValid(disputeTemplate),
  //   args: [
  //     prepareArbitratorExtradata(disputeData.courtId ?? "1", disputeData.numberOfJurors ?? "", 1), //TODO: decide which dispute kit to use
  //     JSON.stringify(disputeTemplate),
  //     "",
  //     BigInt(disputeTemplate.answers.length),
  //   ],
  //   value: BigInt(disputeData.arbitrationCost ?? 0),
  // });

  // const { writeAsync: submitCase } = useDisputeResolverCreateDisputeForTemplate(submitCaseConfig);

  // const isButtonDisabled = useMemo(
  //   () => isSubmittingCase || !isTemplateValid(disputeTemplate),
  //   [isSubmittingCase, disputeTemplate]
  // );

  return (
    <>
      {" "}
      <EnsureChain>
        <StyledButton
          text="Submit Item"
          disabled={false}
          isLoading={false}
          // onClick={() => {
          //   if (submitCase) {
          //     setIsSubmittingCase(true);
          //     wrapWithToast(async () => await submitCase().then((response) => response.hash), publicClient)
          //       .then((res) => {
          //         if (res.status && !isUndefined(res.result)) {
          //           const id = retrieveDisputeId(res.result.logs[1]);
          //           setDisputeId(Number(id));
          //           setCourtId(disputeData.courtId ?? "1");
          //           setIsPopupOpen(true);
          //           resetDisputeData();
          //         }
          //       })
          //       .finally(() => {
          //         setIsSubmittingCase(false);
          //       });
          //   }
          // }}
        />
      </EnsureChain>
      {/* {isPopupOpen && disputeId && (
        <Popup
          title={`Case #${disputeId} submitted`}
          icon={DisputeIcon}
          popupType={PopupType.DISPUTE_CREATED}
          setIsOpen={setIsPopupOpen}
          disputeId={disputeId}
          courtId={courtId}
        />
      )} */}
    </>
  );
};

export default SubmitItemButton;
