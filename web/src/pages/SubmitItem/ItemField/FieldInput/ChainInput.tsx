import React from "react";
import { IFieldInput } from ".";
import { DropdownSelect } from "@kleros/ui-components-library";
import { getChainName } from "components/ChainIcon";
import { arbitrum, gnosis, mainnet, polygon } from "viem/chains";

const ChainInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (value: string | number) => {
    handleWrite(value.toString());
  };
  return (
    <DropdownSelect
      items={[
        { id: mainnet.id, text: getChainName(mainnet.id), itemValue: mainnet.id },
        { id: arbitrum.id, text: getChainName(arbitrum.id), itemValue: arbitrum.id },
        { id: gnosis.id, text: getChainName(gnosis.id), itemValue: gnosis.id },
        { id: polygon.id, text: getChainName(polygon.id), itemValue: polygon.id },
      ]}
      callback={(item) => handleChange(item.itemValue)}
      defaultValue={Number(fieldProp.value ?? mainnet.id)}
    />
  );
};

export default ChainInput;
