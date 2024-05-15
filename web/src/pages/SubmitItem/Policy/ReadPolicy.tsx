import React from "react";
import styled from "styled-components";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { getIpfsUrl } from "utils/getIpfsUrl";

const StyledA = styled.a`
  align-self: center;
  font-size: 20px;
  margin-bottom: 32px;
`;

interface IReadPolicy {}

const ReadPolicy: React.FC<IReadPolicy> = () => {
  const { policyURI } = useRegistryDetailsContext();
  return (
    <StyledA href={getIpfsUrl(policyURI ?? "")} target="_blank">
      → Read the policy here ←
    </StyledA>
  );
};

export default ReadPolicy;
