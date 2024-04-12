import { Steps } from "@kleros/ui-components-library";
import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import useIsDesktop from "hooks/useIsDesktop";
import { landscapeStyle } from "styles/landscapeStyle";

const Container = styled.div`
  width: 100%;
  padding: 31px;
  > div {
    width: 100%;
  }
  .rc-slider-disabled {
    background-color: transparent;
  }
`;

const StyledSteps = styled(Steps)`
  height: auto;
  ${landscapeStyle(
    () => css`
      padding-top: 16px;
      padding-bottom: 16px;
    `
  )}
`;

const Progress: React.FC = () => {
  const { progress } = useSubmitListContext();
  const isDesktop = useIsDesktop();
  const progressValue = useMemo(() => {
    switch (progress) {
      case ListProgress.ConfirmingDeploy:
        return 1;
      case ListProgress.Deployed:
        return 2;
      case ListProgress.ConfirmingSubmit:
        return 3;
      case ListProgress.SubmitSuccess:
        return 4;
      default:
        return 0;
    }
  }, [progress]);

  const steps = [
    { title: "Start" },
    { title: "Confirm" },
    { title: "Deployed" },
    { title: "Confirm Submit" },
    { title: "Submitted" },
  ];

  return (
    <Container>
      <StyledSteps items={steps} currentItemIndex={progressValue} horizontal={isDesktop} />
    </Container>
  );
};
export default Progress;
