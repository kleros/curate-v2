import React from "react";
import styled from "styled-components";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { Link } from "react-router-dom";

const StyledA = styled(Link)`
  align-self: center;
  font-size: 20px;
  margin-bottom: 32px;
`;

interface IReadPolicy {}

const ReadPolicy: React.FC<IReadPolicy> = () => {
  const { policyURI } = useRegistryDetailsContext();
  return <StyledA to={`/attachment/?url=${getIpfsUrl(policyURI ?? "")}`}>→ Read the policy here ←</StyledA>;
};

export default ReadPolicy;
