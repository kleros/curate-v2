import { version, gitCommitHash, gitCommitShortHash, gitBranch, gitTags, clean } from "../generatedGitInfo.json";
import { Status } from "./status";

export const ONE_BASIS_POINT = 10000n;

export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.kleros.io";

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

export const items = [
  {
    id: 1,
    title: "ENS Resolver",
    address: "0x922911F4f80a569a4425fa083456239838F7F003",
    website: "metamask.io",
    status: Status.Removed,
  },
  {
    id: 2,
    title: "ENS Resolver",
    address: "0x922911F4f80a569a4425fa083456239838F7F003",
    website: "metamask.io",
    status: Status.Removed,
  },
  {
    id: 3,
    title: "ENS Resolver",
    address: "0x922911F4f80a569a4425fa083456239838F7F003",
    website: "metamask.io",
    status: Status.Removed,
  },
  {
    id: 4,
    title: "ENS Resolver",
    address: "0x922911F4f80a569a4425fa083456239838F7F003",
    website: "metamask.io",
    status: Status.Removed,
  },
  {
    id: 5,
    title: "ENS Resolver",
    address: "0x922911F4f80a569a4425fa083456239838F7F003",
    website: "metamask.io",
    status: Status.Removed,
  },
];
