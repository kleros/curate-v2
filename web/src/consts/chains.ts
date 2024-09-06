import { Chain, arbitrum, arbitrumSepolia, mainnet } from "wagmi/chains";

import { isProductionDeployment } from "./index";

export const DEFAULT_CHAIN = isProductionDeployment() ? arbitrum.id : arbitrumSepolia.id;

// Read/Write
export const SUPPORTED_CHAINS: Record<number, Chain> = {
  [isProductionDeployment() ? arbitrum.id : arbitrumSepolia.id]: isProductionDeployment() ? arbitrum : arbitrumSepolia,
};

export const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_CHAINS);

// Read Only
export const QUERY_CHAINS: Record<number, Chain> = {
  [mainnet.id]: mainnet,
};

export const ALL_CHAINS = [...Object.values(SUPPORTED_CHAINS), ...Object.values(QUERY_CHAINS)];
export const QUERY_CHAIN_IDS = Object.keys(QUERY_CHAINS);
