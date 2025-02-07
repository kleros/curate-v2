import React from "react";

import { fallback, http, WagmiProvider, webSocket } from "wagmi";
import { mainnet, arbitrumSepolia, arbitrum, sepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { ALL_CHAINS, DEFAULT_CHAIN } from "consts/chains";
import { isProductionDeployment } from "consts/index";

import { lightTheme } from "styles/themes";

const alchemyApiKey = import.meta.env.ALCHEMY_API_KEY ?? "";
const isProduction = isProductionDeployment();

// https://github.com/alchemyplatform/alchemy-sdk-js/blob/96b3f62/src/types/types.ts#L98-L119
const alchemyToViemChain = {
  [arbitrum.id]: "arb-mainnet",
  [arbitrumSepolia.id]: "arb-sepolia",
  [mainnet.id]: "eth-mainnet",
  [sepolia.id]: "eth-sepolia",
};

type AlchemyProtocol = "https" | "wss";

// https://github.com/alchemyplatform/alchemy-sdk-js/blob/96b3f62/src/util/const.ts#L16-L18
const alchemyURL = (protocol: AlchemyProtocol, chainId: number | string) =>
  `${protocol}://${alchemyToViemChain[chainId]}.g.alchemy.com/v2/${alchemyApiKey}`;

export const getChainRpcUrl = (protocol: AlchemyProtocol, chainId: number | string) => {
  return alchemyURL(protocol, chainId);
};

export const getDefaultChainRpcUrl = (protocol: AlchemyProtocol) => {
  return getChainRpcUrl(protocol, DEFAULT_CHAIN);
};

export const getTransports = () => {
  const alchemyTransport = (chain: AppKitNetwork) =>
    fallback([http(alchemyURL("https", chain.id)), webSocket(alchemyURL("wss", chain.id))]);

  return {
    [isProduction ? arbitrum.id : arbitrumSepolia.id]: isProduction
      ? alchemyTransport(arbitrum)
      : alchemyTransport(arbitrumSepolia),
    [mainnet.id]: alchemyTransport(mainnet), // Always enabled for ENS resolution
  };
};

const chains = ALL_CHAINS as [AppKitNetwork, ...AppKitNetwork[]];
const transports = getTransports();
const projectId = import.meta.env.WALLETCONNECT_PROJECT_ID ?? "";
const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  transports,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  defaultNetwork: isProduction ? arbitrum : arbitrumSepolia,
  projectId,
  themeVariables: {
    "--w3m-color-mix": lightTheme.primaryPurple,
    "--w3m-color-mix-strength": 20,
    // overlay portal is at 9999
    "--w3m-z-index": 10000,
  },
});
const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <WagmiProvider config={wagmiAdapter.wagmiConfig}> {children} </WagmiProvider>;
};

export default Web3Provider;
