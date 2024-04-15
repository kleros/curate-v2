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
`;

const StyledLabel = styled.label<{ alignRight?: boolean; top?: boolean }>`
  text-align: ${({ alignRight }) => (alignRight ? "end" : "start")};
  float: ${({ alignRight }) => (alignRight ? "right" : "left")};
  color: ${({ theme, top }) => (top ? theme.primaryText : theme.secondaryText)};
`;

const Wrapper = styled.div<{ top?: boolean }>`
  ${({ top }) => (top ? "margin-bottom: 12px;" : "margin-top: 12px")}
`;

const ElementWrapper = styled.div<{ alignRight?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${({ alignRight }) => (alignRight ? "end" : "start")};
  align-items: top;
`;

const Label: React.FC<{
  label: string;
  tooltipMsg?: string;
  alignRight?: boolean;
  top?: boolean;
}> = ({ label, tooltipMsg, alignRight, top }) => {
  return (
    <Wrapper {...{ top }}>
      {tooltipMsg ? (
        <WithHelpTooltip tooltipMsg={tooltipMsg} place="top">
          <StyledLabel id={label} {...{ alignRight, top }}>
            {label}
          </StyledLabel>
        </WithHelpTooltip>
      ) : (
        <StyledLabel id={label} {...{ alignRight, top }}>
          {label}
        </StyledLabel>
      )}
    </Wrapper>
  );
};

interface LabelOptions {
  text: React.ReactElement | string;
  tooltipMsg?: string;
  tooltipPlace?: "top" | "bottom" | "left" | "right";
}
interface ILabeledInput extends FieldProps {
  topLeftLabel?: LabelOptions;
  topRightLabel?: LabelOptions;
  bottomLeftLabel?: LabelOptions;
  bottomRightLabel?: LabelOptions;
}

const LabeledInput: React.FC<ILabeledInput> = (props) => {
  const { topLeftLabel, topRightLabel, bottomLeftLabel, bottomRightLabel } = props;

  return (
    <Container>
      {/* top left label */}
      {!isUndefined(topLeftLabel) && typeof topLeftLabel.text === `string` ? (
        <Label label={topLeftLabel.text} tooltipMsg={topLeftLabel.tooltipMsg} top />
      ) : null}

      {!isUndefined(topLeftLabel) && isReactElement(topLeftLabel.text) ? (
        <ElementWrapper>{topLeftLabel.text}</ElementWrapper>
      ) : null}

      {/* top right label */}
      {!isUndefined(topRightLabel) && typeof topRightLabel.text === `string` ? (
        <Label label={topRightLabel.text} alignRight tooltipMsg={topRightLabel.tooltipMsg} top />
      ) : null}

      {!isUndefined(topRightLabel) && isReactElement(topRightLabel.text) ? (
        <ElementWrapper alignRight>{topRightLabel.text}</ElementWrapper>
      ) : null}

      <StyledField {...props} className="field" />

      {/* bottom left label */}
      {!isUndefined(bottomLeftLabel) && typeof bottomLeftLabel.text === `string` ? (
        <Label label={bottomLeftLabel.text} tooltipMsg={bottomLeftLabel.tooltipMsg} />
      ) : null}

      {!isUndefined(bottomLeftLabel) && isReactElement(bottomLeftLabel.text) ? (
        <ElementWrapper>{bottomLeftLabel.text}</ElementWrapper>
      ) : null}

      {/* bottom right label */}
      {!isUndefined(bottomRightLabel) && typeof bottomRightLabel.text === `string` ? (
        <Label label={bottomRightLabel.text} alignRight tooltipMsg={bottomRightLabel.tooltipMsg} />
      ) : null}

      {!isUndefined(bottomRightLabel) && isReactElement(bottomRightLabel.text) ? (
        <ElementWrapper alignRight>{bottomRightLabel.text}</ElementWrapper>
      ) : null}
    </Container>
  );
};

function isReactElement(value: string | React.ReactElement): value is React.ReactElement {
  return React.isValidElement(value);
}
export default LabeledInput;
