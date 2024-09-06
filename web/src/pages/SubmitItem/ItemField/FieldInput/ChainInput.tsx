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
        { text: getChainName(mainnet.id), value: mainnet.id },
        { text: getChainName(arbitrum.id), value: arbitrum.id },
        { text: getChainName(gnosis.id), value: gnosis.id },
        { text: getChainName(polygon.id), value: polygon.id },
      ]}
      callback={handleChange}
      defaultValue={Number(fieldProp.value ?? mainnet.id)}
    />
  );
};

export default ChainInput;
