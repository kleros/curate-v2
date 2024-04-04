import { Slider } from "@kleros/ui-components-library";
import React, { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";

const Container = styled.div`
  width: 100%;
  padding: 24px;
  > div {
    width: 100%;
  }
  .rc-slider-disabled {
    background-color: transparent;
  }
`;

const StyledSlider = styled(Slider)`
  small {
    color: ${({ theme }) => theme.success};
  }
`;

const Progress: React.FC = () => {
  const theme = useTheme();
  const { progress } = useSubmitListContext();
  const progressValue = useMemo(() => {
    switch (progress) {
      case ListProgress.ConfirmingDeploy:
        return 0;
      case ListProgress.ConfirmedDeploy:
        return 20;
      case ListProgress.Deployed:
        return 40;
      case ListProgress.ConfirmingSubmit:
        return 60;
      case ListProgress.ConfirmedSubmit:
        return 80;
      case ListProgress.SubmitSuccess:
        return 100;
      default:
        return 0;
    }
  }, [progress]);
  return (
    <Container>
      <StyledSlider
        style={{ width: "100%" }}
        trackStyle={
          [
            {
              backgroundColor: theme.success,
              height: "8px",
              borderRadius: "30px",
              cursor: "pointer",
            },
          ] as any
        }
        handleStyle={{
          width: "8px",
          height: "8px",
          backgroundColor: theme.success,
          border: "none",
          color: theme.success,
          marginTop: "-8px",
        }}
        callback={() => {}}
        min={0}
        max={100}
        value={progressValue}
        disabled
        leftLabel="Start"
        rightLabel="List created"
        label={`${progressValue}%`}
      />
    </Container>
  );
};
export default Progress;
