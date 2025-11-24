import React from "react";
import { getChainById } from "utils/getChainById";
import ChainIcon, { getChainName } from "components/ChainIcon";

export interface IChainField {
  value: string;
}

const ChainField: React.FC<IChainField> = ({ value }) => {
  const chain = getChainById(Number(value));

  const chainName = getChainName(chain.id);

  return (
    <div className="flex gap-2 items-center">
      <ChainIcon chainId={chain.id} />
      <p>{chainName}</p>
    </div>
  );
};

export default ChainField;
