import { IPFS_GATEWAY } from "consts/index";
import { isUndefined } from ".";

export const getIpfsUrl = (url: string) => {
  if (isUndefined(url)) return "";
  const formatedIPFSPath = getFormattedPath(url);
  return `${IPFS_GATEWAY}${formatedIPFSPath}`;
};

export const getFormattedPath = (url: string) => {
  if (url.startsWith("/ipfs/")) return url;
  else if (url.startsWith("ipfs/")) return "/" + url;
  else if (url.startsWith("ipfs://")) return url.replace("ipfs://", "/ipfs/");
  return url;
};
