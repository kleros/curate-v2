import { version, gitCommitHash, gitCommitShortHash, gitBranch, gitTags, clean } from "../generatedGitInfo.json";
import GeneratedMainCurate from "../generatedMainCurateAddress.json";

export const ONE_BASIS_POINT = 10000n;
export const IPFS_GATEWAY = import.meta.env.REACT_APP_IPFS_GATEWAY || "https://cdn.kleros.link";

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

export const DEFAULT_LIST_LOGO = "ipfs://QmWfxEmfEWwM6LDgER2Qp2XZpK1MbDtNp7uGqCS4UPNtgJ/symbol-CURATE.png";

export const COURT_SITE = import.meta.env.COURT_SITE ?? "https://v2.kleros.builders/#";

export const SUPPORTED_FILE_TYPES = ["application/pdf", "text/rtf", "text/markdown", "text/plain"];

export const MAIN_CURATE_ADDRESS = GeneratedMainCurate.mainCurateAddress;

export const isProductionDeployment = () => import.meta.env.REACT_APP_DEPLOYMENT === "mainnet";
