import React from "react";
import styled from "styled-components";
import { AddressOrName, IdenticonOrAvatar } from "../ConnectWallet/AccountDisplay";
import { useEnsAddress } from "wagmi";
import { isAddress } from "viem";
import Skeleton from "react-loading-skeleton";

const AliasContainer = styled.div`
  min-height: 32px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  > label {
    color: ${({ theme }) => theme.primaryText};
    font-size: 14px;
  }
`;

interface IAlias {
  address: string;
  className?: string;
}

const AliasDisplay: React.FC<IAlias> = ({ address, className }) => {
  const { data: addressFromENS, isLoading } = useEnsAddress({
    enabled: !isAddress(address),
    name: address,
    chainId: 1,
  });

  const finalAddress = addressFromENS ?? address;

  return (
    <AliasContainer {...{ className }}>
      {isLoading ? <Skeleton width={30} height={24} /> : <IdenticonOrAvatar address={finalAddress} size="24" />}
      <TextContainer>
        {isLoading ? <Skeleton width={30} height={24} /> : <AddressOrName address={finalAddress} />}&nbsp;
      </TextContainer>
    </AliasContainer>
  );
};

export default AliasDisplay;
