import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircle from "svgs/icons/check-circle-outline.svg";
import styled from "styled-components";

const StyledCheckCircle = styled(CheckCircle)`
  path {
    fill: #000;
  }
`;

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDeployPage = location.pathname.includes("/deploy");
  const isButtonDisabled = false;
  return (
    <Button
      disabled={isButtonDisabled}
      onClick={() => navigate(nextRoute)}
      text={isDeployPage ? "Create List" : "Next"}
      Icon={isDeployPage ? StyledCheckCircle : undefined}
    />
  );
};

export default NextButton;
