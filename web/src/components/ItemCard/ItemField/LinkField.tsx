import React from "react";
import styled from "styled-components";
import Globe from "svgs/icons/globe.svg";

const Container = styled.a`
  display: flex;
  gap: 8px;
`;

export interface ILinkField {
  value: string;
  detailed?: boolean;
}

const LinkField: React.FC<ILinkField> = ({ value }) => {
  return (
    <Container href={value} onClick={(event) => event.stopPropagation()} target="blank" rel="noreferrer">
      <Globe />
      {value}
    </Container>
  );
};

export default LinkField;
