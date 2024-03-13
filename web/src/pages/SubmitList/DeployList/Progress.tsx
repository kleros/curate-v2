import { Slider } from "@kleros/ui-components-library";
import React from "react";
import styled, { useTheme } from "styled-components";

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
    margin-left: 8px;
  }
`;

const Progress: React.FC = () => {
  const theme = useTheme();
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
        value={50}
        disabled
        leftLabel="Start"
        rightLabel="List created"
        label={`50%`}
      />
    </Container>
  );
};
export default Progress;
