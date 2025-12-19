import React from "react";
import NavigationButtons from "../NavigationButtons";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { BASE_CONTAINER_STYLE } from "../constants";
import { TextField } from "@kleros/ui-components-library";

const CustomName: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();
  return (
    <div className={BASE_CONTAINER_STYLE}>
      <Header text="Custom Item Name" />
      <label className="w-full">
        By default, we use the words (item, items) to describe the content of a list. If desired, you can customize it.
        Example: A list of: (Token, Tokens), (Tag, Tags), (Car, Cars), etc.
      </label>
      <div className="w-full grid grid-cols-[1fr] gap-5 lg:grid-cols-[1fr_1fr]">
        <TextField
          className="w-full"
          label="Custom item name"
          placeholder="Item"
          value={listMetadata.itemName ?? ""}
          onChange={(value) => setListMetadata({ ...listMetadata, itemName: value })}
        />
        <TextField
          className="w-full"
          label="Plural"
          placeholder="Items"
          value={listMetadata.itemNamePlural ?? ""}
          onChange={(value) => setListMetadata({ ...listMetadata, itemNamePlural: value })}
        />
      </div>
      <NavigationButtons prevRoute="/submit-list/item-preview" nextRoute="/submit-list/advanced" />
    </div>
  );
};
export default CustomName;
