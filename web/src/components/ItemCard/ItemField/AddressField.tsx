import React from "react";
import styled from "styled-components";
import Etherscan from "svgs/icons/etherscan.svg";
import { getChainById } from "utils/getChainById";
import { shortenAddress } from "utils/shortenAddress";

const Container = styled.a`
  display: flex;
  gap: 8px;
`;

const StyledEtherscanIcon = styled(Etherscan)`
  width: 16px;
  height: 16px;
`;
export interface IAddressField {
  value: string;
  chainId: number;
}

const AddressField: React.FC<IAddressField> = ({ value, chainId }) => {
  const chain = getChainById(chainId);
  const explorerUrl = chain?.blockExplorers?.default.url;

  return (
    <Container
      href={`${explorerUrl}/address/${value}`}
      onClick={(event) => event.stopPropagation()}
      target="blank"
      rel="noreferrer"
    >
      <StyledEtherscanIcon />
      {shortenAddress(value)}
    </Container>
  );
};

export default AddressField;
