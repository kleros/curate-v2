import React from "react";
import { arbitrum, arbitrumSepolia, gnosis, gnosisChiado, polygon, polygonMumbai } from "viem/chains";
import { mainnet, sepolia } from "wagmi";
import EthIcon from "svgs/chains/ethereum.svg";
import PolygonIcon from "svgs/chains/polygon.svg";
import GnosisIcon from "svgs/chains/gnosis.svg";
import styled from "styled-components";

const getChainIcon = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
    case sepolia.id:
      return <EthIcon />;
    case arbitrum.id:
    case arbitrumSepolia.id:
      return <EthIcon />;
    case gnosis.id:
    case gnosisChiado.id:
      return <GnosisIcon />;
    case polygon.id:
    case polygonMumbai.id:
      return <PolygonIcon />;
    default:
      return <EthIcon />;
  }
};

const SVGContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: ${({ theme }) => theme.secondaryPurple};
    height: 24px;
    width: 24px;
  }
`;

const ChainIcon: React.FC<{ chainId: number }> = ({ chainId }) => <SVGContainer>{getChainIcon(chainId)}</SVGContainer>;

export default ChainIcon;
