import { Field, FieldProps } from "@kleros/ui-components-library";
import React from "react";
import styled from "styled-components";
import { isUndefined } from "utils/index";
import WithHelpTooltip from "./WithHelpTooltip";

const Container = styled.div`
  width: 100%;
  height: min-content;
  display: grid;
  grid-template-columns: auto auto;
  .field {
    grid-column: span 2;
  }
`;

const StyledField = styled(Field)`
  width: 100%;
  > small {
    margin-top: 16px;
    margin-bottom: 16px;
  }
`;

const StyledLabel = styled.label<{ alignRight?: boolean }>`
  text-align: ${({ alignRight }) => (alignRight ? "end" : "start")};
  float: ${({ alignRight }) => (alignRight ? "right" : "left")};
`;

const Wrapper = styled.div<{ top?: boolean }>`
  ${({ top }) => (top ? "margin-bottom: 12px;" : "margin-top: 12px")}
`;

const Label: React.FC<{ label: string; tooltipMsg?: string; alignRight?: boolean; top?: boolean }> = ({
  label,
  tooltipMsg,
  alignRight,
  top,
}) => {
  return (
    <Wrapper {...{ top }}>
      {tooltipMsg ? (
        <WithHelpTooltip tooltipMsg={tooltipMsg} place={alignRight ? "left" : "right"}>
          <StyledLabel id={label} {...{ alignRight }}>
            {label}
          </StyledLabel>
        </WithHelpTooltip>
      ) : (
        <StyledLabel id={label} {...{ alignRight }}>
          {label}
        </StyledLabel>
      )}
    </Wrapper>
  );
};

interface ILabeledInput extends FieldProps {
  topLeftLabel?: string;
  topRightLabel?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  topLeftMsg?: string;
  topRightMsg?: string;
  bottomLeftMsg?: string;
  bottomRightMsg?: string;
}

const LabeledInput: React.FC<ILabeledInput> = (props) => {
  const {
    topLeftLabel,
    topRightLabel,
    bottomLeftLabel,
    bottomRightLabel,
    topLeftMsg,
    topRightMsg,
    bottomLeftMsg,
    bottomRightMsg,
  } = props;

  const label = topLeftLabel || topRightLabel || bottomLeftLabel || bottomRightLabel;

  return (
    <Container>
      {!isUndefined(topLeftLabel) ? <Label label={topLeftLabel} tooltipMsg={topLeftMsg} top /> : null}
      {!isUndefined(topRightLabel) ? <Label label={topRightLabel} alignRight tooltipMsg={topRightMsg} top /> : null}
      <StyledField {...props} id={label} className="field" />
      {!isUndefined(bottomLeftLabel) ? <Label label={bottomLeftLabel} tooltipMsg={bottomLeftMsg} /> : null}
      {!isUndefined(bottomRightLabel) ? (
        <Label label={bottomRightLabel} alignRight tooltipMsg={bottomRightMsg} />
      ) : null}
    </Container>
  );
};

export default LabeledInput;
