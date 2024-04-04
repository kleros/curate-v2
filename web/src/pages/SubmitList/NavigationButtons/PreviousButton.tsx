import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { useNavigate } from "react-router-dom";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";

const StyledButton = styled(Button)<{ prevRoute: string }>`
  display: ${({ prevRoute }) => (prevRoute === "" ? "none" : "flex")};
`;

interface IReturnButton {
  prevRoute: string;
}

const ReturnButton: React.FC<IReturnButton> = ({ prevRoute }) => {
  const navigate = useNavigate();
  const { progress, isSubmittingList } = useSubmitListContext();
  return (
    progress !== ListProgress.SubmitSuccess && (
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
