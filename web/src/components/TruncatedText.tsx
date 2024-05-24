import React from "react";
import styled from "styled-components";

const StyledText = styled.h3`
  font-weight: 400;
  margin: 0px;
`;

interface ITruncatedText {
  text: string;
  maxLength: number;
  className?: string;
}

/**
 *
 * @param text text to be truncated
 * @returns A Truncated text element
 */
const TruncatedText: React.FC<ITruncatedText> = ({ text, maxLength, className }) => {
  const truncatedText = text?.length <= maxLength ? text : text?.slice(0, maxLength) + "…";
  return <StyledText {...{ className }}>{truncatedText}</StyledText>;
};

export default TruncatedText;
