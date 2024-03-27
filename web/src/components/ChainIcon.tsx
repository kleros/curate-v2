import React from "react";
import { arbitrum, arbitrumSepolia, gnosis, gnosisChiado, polygon, polygonMumbai } from "viem/chains";
import { mainnet, sepolia } from "wagmi";
import EthIcon from "svgs/chains/ethereum.svg";
import PolygonIcon from "svgs/chains/polygon.svg";
import GnosisIcon from "svgs/chains/gnosis.svg";
import ArbitrumIcon from "svgs/chains/arbitrum.svg";
import styled from "styled-components";

export const getChainIcon = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
    case sepolia.id:
      return <EthIcon />;
    case arbitrum.id:
    case arbitrumSepolia.id:
      return <ArbitrumIcon />;
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

export const getChainName = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
    case sepolia.id:
      return "Ethereum";
    case arbitrum.id:
    case arbitrumSepolia.id:
      return "Arbitrum";
    case gnosis.id:
    case gnosisChiado.id:
      return "Gnosis";
    case polygon.id:
    case polygonMumbai.id:
      return "Polygon";
    default:
      return "Ethereum";
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
