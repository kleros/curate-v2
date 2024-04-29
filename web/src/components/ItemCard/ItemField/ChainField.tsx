import React from "react";
import styled from "styled-components";
import { getChainById } from "utils/getChainById";
import ChainIcon, { getChainName } from "components/ChainIcon";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledP = styled.p`
  margin: 0px;
`;

export interface IChainField {
  value: string;
}

const ChainField: React.FC<IChainField> = ({ value }) => {
  console.log({ value });

  const chain = getChainById(Number(value));

  const chainName = getChainName(chain.id);

  return (
    <Container>
      <ChainIcon chainId={chain.id} />
      <StyledP>{chainName}</StyledP>
    </Container>
  );
};

export default ChainField;
