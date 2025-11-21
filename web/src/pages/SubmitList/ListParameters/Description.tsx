import React from "react";
import NavigationButtons from "../NavigationButtons";
import Header from "../Header";
import { TextField } from "@kleros/ui-components-library";
import { useSubmitListContext } from "context/SubmitListContext";
import { cn } from "~src/utils";
import { BASE_CONTAINER_LANDSCAPE_WIDTH_CALC, BASE_CONTAINER_STYLE } from "../constants";
const Description: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const handleWrite = (value: string) => {
    setListMetadata({ ...listMetadata, description: value });
  };
  return (
    <div className={cn(BASE_CONTAINER_STYLE, BASE_CONTAINER_LANDSCAPE_WIDTH_CALC)}>
      <Header text="Description" />
      <TextField
        className="w-full"
        onChange={handleWrite}
        placeholder="eg. A list of public name tags, associated with Ethereum mainnet contract addresses."
        value={listMetadata.description}
        message="Type a short sentence describing the content of the list. eg. A list of public name tags, associated with Ethereum mainnet contract addresses."
        variant="info"
      />
      <NavigationButtons prevRoute="/submit-list/title" nextRoute="/submit-list/logo" />
    </div>
  );
};
export default Description;
