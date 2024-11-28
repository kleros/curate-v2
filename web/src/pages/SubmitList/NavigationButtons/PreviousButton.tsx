import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { isEmpty } from "src/utils";

const StyledButton = styled(Button)<{ prevRoute: string }>`
  display: ${({ prevRoute }) => (isEmpty(prevRoute) ? "none" : "flex")};
`;

interface IReturnButton {
  prevRoute: string;
}

const ReturnButton: React.FC<IReturnButton> = ({ prevRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDeployPage = location.pathname.includes("/deploy");

  const { progress, isSubmittingList } = useSubmitListContext();

  const hideReturn = isDeployPage && progress === ListProgress.SubmitSuccess;
  return (
    !hideReturn && (
      <StyledButton
        prevRoute={prevRoute}
        onClick={() => navigate(prevRoute)}
        text="Return"
        variant="secondary"
        disabled={isSubmittingList}
      ></StyledButton>
    )
  );
};

export default ReturnButton;
