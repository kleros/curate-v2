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
    (location.pathname.includes("/submitList/title") && !listMetadata.title) ||
    (location.pathname.includes("/submitList/description") && !listMetadata.description) ||
    (location.pathname.includes("/submitList/court") && !listData.courtId) ||
    (location.pathname.includes("/submitList/custom") && !listMetadata.itemName && !listMetadata.itemNamePlural) ||
    (location.pathname.includes("/submitList/fields") && !areItemFieldsFilled) ||
    (location.pathname.includes("/submitList/policy") && (isPolicyUploading || !listMetadata.policyURI)) ||
    (location.pathname.includes("/submitList/logo") && (isLogoUploading || !listMetadata.logoURI)) ||
    (location.pathname.includes("/submitList/advanced") && !areAdvancedParamsFilled) ||
    !listData.courtId ||
    !listData.numberOfJurors;

  return isDeployPage ? (
    <SubmitListButton />
  ) : (
    <Button disabled={isButtonDisabled} onClick={() => navigate(nextRoute)} text="Next" />
  );
};

export default NextButton;
