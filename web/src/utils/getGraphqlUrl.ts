import { arbitrumSepolia } from "wagmi/chains";

export const getGraphqlUrl = (isCore: boolean = false, chainId: number = arbitrumSepolia.id) => {
  if (isCore)
    return process.env.REACT_APP_CORE_SUBGRAPH ?? "Wrong Subgraph URL. Please check the environment variables.";
  return process.env.REACT_APP_ARBSEPOLIA_SUBGRAPH ?? "Wrong Subgraph URL. Please check the environment variables.";
};
