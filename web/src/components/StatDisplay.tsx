import React, { useMemo } from "react";
import { landscapeStyle } from "styles/landscapeStyle";
import styled, { useTheme, css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Theme } from "styled-components";

const Container = styled.div`
  display: flex;
  max-width: 196px;
  align-items: center;
  gap: 8px;

  ${landscapeStyle(
    () => css`
      margin-bottom: ${responsiveSize(16, 30)};
    `
  )}
`;

const SVGContainer = styled.div<{ iconColor: string; backgroundColor: string }>`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: ${({ iconColor }) => iconColor};
    height: 21px;
    width: 21px;
  }
`;

const TextContainer = styled.div`
  h1 {
    margin: 0;
  }
`;

const SubtextLabel = styled.label`
  font-size: 12px;
`;

const COLORS: Record<string, Array<keyof Theme>> = {
  green: ["success", "successLight"],
  blue: ["primaryBlue", "mediumBlue"],
  purple: ["secondaryPurple", "mediumPurple"],
  orange: ["warning", "warningLight"],
};

export type IColors = keyof typeof COLORS;

interface IStatDisplay {
  title: string;
  text: string | React.ReactNode;
  subtext: string | React.ReactNode;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  color: IColors;
}

const StatDisplay: React.FC<IStatDisplay> = ({ title, text, subtext, icon: Icon, color, ...props }) => {
  const theme = useTheme();

  const [iconColor, backgroundColor] = useMemo(() => {
    return COLORS[color].map((color) => theme[color]);
  }, [theme, color]);

  return (
    <Container {...props}>
      <SVGContainer {...{ iconColor, backgroundColor }}>{<Icon />}</SVGContainer>
      <TextContainer>
        <label>{title}</label>
        <h1>{text}</h1>
        <SubtextLabel>{subtext}</SubtextLabel>
      </TextContainer>
    </Container>
  );
};

export default StatDisplay;
