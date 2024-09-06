import { arbitrum, arbitrumSepolia } from "viem/chains";

export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || "https://cdn.kleros.link";

// https://www.w3.org/TR/2012/WD-html-markup-20120329/input.email.html#input.email.attrs.value.single
// eslint-disable-next-line security/detect-unsafe-regex
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const TELEGRAM_REGEX = /^@\w{5,32}$/;
export const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const ETH_SIGNATURE_REGEX = /^0x([a-fA-F0-9]{130})+$|^0x$/;

export const isProductionDeployment = () => process.env.REACT_APP_DEPLOYMENT === "mainnet";

export const DEFAULT_CHAIN = isProductionDeployment() ? arbitrum.id : arbitrumSepolia.id;
