import { version, gitCommitHash, gitCommitShortHash, gitBranch, gitTags, clean } from "../generatedGitInfo.json";
import { Status } from "./status";

export const ONE_BASIS_POINT = 10000n;

export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || "https://cdn.kleros.link";

export const GIT_BRANCH = gitBranch;
export const GIT_TAGS = gitTags;
export const GIT_HASH = gitCommitShortHash;
export const GIT_DIRTY = clean ? "" : "-dirty";
export const GIT_URL = `https://github.com/kleros/curate-v2/tree/${gitCommitHash}/web`;
export const RELEASE_VERSION = version;

// https://www.w3.org/TR/2012/WD-html-markup-20120329/input.email.html#input.email.attrs.value.single
// eslint-disable-next-line security/detect-unsafe-regex
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const TELEGRAM_REGEX = /^@\w{5,32}$/;
export const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const ETH_SIGNATURE_REGEX = /^0x[a-fA-F0-9]{130}$/;

export const lists = [
  {
    id: 1,
    title: "Address Tags",
    totalItems: 24,
    chainId: 1,
    status: Status.Disputed,
    logoURI: "https://ipfs.kleros.io//ipfs/QmNNSDkpyDX1wB4NNFdAzaHsJihpvgNVV89zCH8FH9CVAz/ledger-white.png",
  },
  {
    id: 2,
    title: "Address Tags",
    totalItems: 24,
    chainId: 1,
    status: Status.Included,
    logoURI: "https://ipfs.kleros.io//ipfs/QmP1hU1LaheHVGxcSJWg5sC3g25vs5snam3qP1bVVAa7mT/address-tag-2-1.png",
  },
  {
    id: 3,
    title: "Address Tags",
    totalItems: 24,
    chainId: 1,
    status: Status.Disputed,
    logoURI: "https://ipfs.kleros.io//ipfs/QmNNSDkpyDX1wB4NNFdAzaHsJihpvgNVV89zCH8FH9CVAz/ledger-white.png",
  },
  {
    id: 4,
    title: "Address Tags",
    totalItems: 24,
    chainId: 1,
    status: Status.Disputed,
    logoURI: "https://ipfs.kleros.io//ipfs/QmP1hU1LaheHVGxcSJWg5sC3g25vs5snam3qP1bVVAa7mT/address-tag-2-1.png",
  },
  {
    id: 5,
    title: "Address Tags",
    totalItems: 24,
    chainId: 1,
    status: Status.Pending,
    logoURI: "https://ipfs.kleros.io//ipfs/QmNNSDkpyDX1wB4NNFdAzaHsJihpvgNVV89zCH8FH9CVAz/ledger-white.png",
  },
  {
    id: 6,
    title: "Address Tags",
    totalItems: 24,
    chainId: 1,
    status: Status.Removed,
    logoURI: "https://ipfs.kleros.io//ipfs/QmZPeWnzHGKwvnckQE2QrdRJiUFqQXvQEZGFHdEAh7raHN/fno.png",
  },
];
