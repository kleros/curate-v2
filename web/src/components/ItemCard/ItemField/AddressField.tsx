import React from "react";
import Etherscan from "svgs/icons/etherscan.svg";
import { getChainById } from "utils/getChainById";
import { shortenAddress } from "utils/shortenAddress";
export interface IAddressField {
  value: string;
  chainId: number;
}

const AddressField: React.FC<IAddressField> = ({ value, chainId }) => {
  const chain = getChainById(chainId);
  const explorerUrl = chain?.blockExplorers?.default.url;

  return (
    <a
      className="flex gap-2"
      href={`${explorerUrl}/address/${value}`}
      onClick={(event) => event.stopPropagation()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Etherscan width={16} height={16} />
      {shortenAddress(value)}
    </a>
  );
};

export default AddressField;
