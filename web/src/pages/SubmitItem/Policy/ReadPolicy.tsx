import React from "react";
import styled from "styled-components";

const StyledA = styled.a`
  align-self: center;
  font-size: 20px;
  margin-bottom: 32px;
`;

interface IReadPolicy {}

const ReadPolicy: React.FC<IReadPolicy> = () => {
  return (
    <StyledA
      href="https://cdn.kleros.link/ipfs/QmSxGYpXHBWBGvGnBeZD1pFxh8fRHj4Z7o3fBzrGiqNx4v/tokens-policy.pdf"
      target="_blank"
    >
      → Read the policy here ←
    </StyledA>
  );
};

export default ReadPolicy;
