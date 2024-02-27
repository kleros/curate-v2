import { arbitrumSepolia } from "wagmi/chains";

export const getGraphqlUrl = (chainId: number = arbitrumSepolia.id) =>
  process.env.REACT_APP_ARBSEPOLIA_SUBGRAPH ?? "Wrong";
