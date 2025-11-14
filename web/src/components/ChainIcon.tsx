import React from "react";
import { arbitrum, arbitrumSepolia, gnosis, gnosisChiado, mainnet, polygon, polygonMumbai, sepolia } from "viem/chains";
import EthIcon from "svgs/chains/ethereum.svg";
import PolygonIcon from "svgs/chains/polygon.svg";
import GnosisIcon from "svgs/chains/gnosis.svg";
import ArbitrumIcon from "svgs/chains/arbitrum.svg";

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

const ChainIcon: React.FC<{ chainId: number }> = ({ chainId }) => (
  <div className="flex items-center justify-center [&_svg]:fill-klerosUIComponentsSecondaryPurple [&_svg]:h-6 [&_svg]:w-6">
    {getChainIcon(chainId)}
  </div>
);

export default ChainIcon;
