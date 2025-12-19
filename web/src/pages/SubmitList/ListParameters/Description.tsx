import React from "react";
import NavigationButtons from "../NavigationButtons";
import Header from "../Header";
import { TextArea } from "@kleros/ui-components-library";
import { useSubmitListContext } from "context/SubmitListContext";
import { BASE_CONTAINER_STYLE } from "../constants";
const Description: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const handleWrite = (value: string) => {
    setListMetadata({ ...listMetadata, description: value });
  };
  return (
    <div className={BASE_CONTAINER_STYLE}>
      <Header text="Description" />
      <TextArea
        className="[&_textarea]:w-full [&_textarea]:h-28 custom-scrollbar"
        aria-label="List description"
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
