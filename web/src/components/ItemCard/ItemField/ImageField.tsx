import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getIpfsUrl } from "utils/getIpfsUrl";

const StyledImg = styled.img<{ detailed?: boolean }>`
  width: ${({ detailed }) => (detailed ? "125px" : "40px")};
  height: ${({ detailed }) => (detailed ? "125px" : "40px")};
  object-fit: contain;
`;

export interface IImageField {
  value: string;
  detailed?: boolean;
}

const ImageField: React.FC<IImageField> = ({ value, detailed }) => {
  const imgUrl = getIpfsUrl(value);
  return (
    <Link to={`/attachment/?url=${imgUrl}`}>
      <StyledImg src={imgUrl} {...{ detailed }} />
    </Link>
  );
};

export default ImageField;
