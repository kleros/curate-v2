import React from "react";
import styled from "styled-components";
import { getIpfsUrl } from "utils/getIpfsUrl";

const StyledImg = styled.img<{ detailed?: boolean }>`
  width: ${({ detailed }) => (detailed ? "125px" : "48px")};
  height: ${({ detailed }) => (detailed ? "125px" : "48px")};
  object-fit: contain;
`;

export interface IImageField {
  value: string;
  detailed?: boolean;
}

const ImageField: React.FC<IImageField> = ({ value, detailed }) => {
  const imgUrl = getIpfsUrl(value);
  return <StyledImg src={imgUrl} {...{ detailed }} />;
};

export default ImageField;
