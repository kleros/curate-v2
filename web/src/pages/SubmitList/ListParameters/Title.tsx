import React from "react";
import { TextField } from "@kleros/ui-components-library";
import NavigationButtons from "../NavigationButtons";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { BASE_CONTAINER_STYLE } from "../constants";

const Title: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const handleWrite = (value: string) => {
    setListMetadata({ ...listMetadata, title: value });
  };
  return (
    <div className={BASE_CONTAINER_STYLE}>
      <Header text="Name" />
      <TextField
        aria-label="List name"
        className="w-full"
        onChange={handleWrite}
        placeholder="eg. Address Tags"
        value={listMetadata.title}
        variant="info"
        message="Choose a short name for the list."
      />
      <NavigationButtons prevRoute="" nextRoute="/submit-list/description" />
    </div>
  );
};
export default Title;
