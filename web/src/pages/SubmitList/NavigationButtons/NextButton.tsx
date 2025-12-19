import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubmitListContext } from "context/SubmitListContext";
import SubmitListButton from "./SubmitListButton";

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listData, listMetadata, isLogoUploading, isPolicyUploading } = useSubmitListContext();

  const areItemFieldsFilled =
    listMetadata.columns && listMetadata.columns.every((column) => column.label !== "" && column.description);

  const isDeployPage = location.pathname.includes("/deploy");
  const areAdvancedParamsFilled =
    listData.arbitrator !== "" &&
    listData.governor !== "" &&
    listData.submissionBaseDeposit !== "" &&
    listData.removalBaseDeposit !== "" &&
    listData.submissionChallengeBaseDeposit !== "" &&
    listData.removalChallengeBaseDeposit !== "" &&
    listData.challengePeriodDuration;

  const isButtonDisabled =
    (location.pathname.includes("/submit-list/title") && !listMetadata.title) ||
    (location.pathname.includes("/submit-list/description") && !listMetadata.description) ||
    (location.pathname.includes("/submit-list/court") && !listData.courtId) ||
    (location.pathname.includes("/submit-list/custom") && !listMetadata.itemName && !listMetadata.itemNamePlural) ||
    (location.pathname.includes("/submit-list/fields") && !areItemFieldsFilled) ||
    (location.pathname.includes("/submit-list/policy") && (isPolicyUploading || !listMetadata.policyURI)) ||
    (location.pathname.includes("/submit-list/logo") && (isLogoUploading || !listMetadata.logoURI)) ||
    (location.pathname.includes("/submit-list/advanced") &&
      (!areAdvancedParamsFilled || !listData.courtId || !listData.numberOfJurors));

  return isDeployPage ? (
    <SubmitListButton />
  ) : (
    <Button isDisabled={isButtonDisabled} onPress={() => navigate(nextRoute)} text="Next" />
  );
};

export default NextButton;
