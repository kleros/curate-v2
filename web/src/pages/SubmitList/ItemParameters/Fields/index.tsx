import React from "react";
import NavigationButtons from "../../NavigationButtons";
import ItemFields from "./ItemFields";
import Header from "../../Header";
import PlusMinusField from "components/PlusMinusField";
import LightButton from "components/LightButton";
import HistoryIcon from "svgs/icons/history.svg";
import { ListField, useSubmitListContext } from "context/SubmitListContext";
import { cn } from "~src/utils";
import { BASE_CONTAINER_LANDSCAPE_WIDTH_CALC, BASE_CONTAINER_STYLE } from "../../constants";

const Fields: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const resetFields = () => {
    setListMetadata({
      ...listMetadata,
      columns: [
        {
          label: "",
          description: "",
          id: 0,
          isIdentifier: false,
          type: "text",
        },
      ],
    });
  };
  const updateNumberOfFields = (value: number) => {
    let defaultField: ListField = {
      label: "",
      description: "",
      id: value - 1,
      isIdentifier: false,
      type: "text",
    };
    const fields = listMetadata.columns;

    if (value < fields?.length) return setListMetadata({ ...listMetadata, columns: [...fields.splice(0, value)] });
    if (value > fields?.length) return setListMetadata({ ...listMetadata, columns: [...fields, defaultField] });
  };

  return (
    <div className={cn(BASE_CONTAINER_STYLE, BASE_CONTAINER_LANDSCAPE_WIDTH_CALC)}>
      <Header text="Item Fields" />
      <div className="flex flex-col gap-4 w-full mb-2.5">
        <label className="w-full">
          Include the fields you want to be displayed on the items on the list. You can add multiple fields by clicking
          on (+). The field order defined here will be used to display the items on the interface. If your item has an
          image, or name add them as the first fields.
        </label>
        <div className="flex justify-center w-full">
          <LightButton
            className="flex gap-1 [&_.button-text]:text-klerosUIComponentsPrimaryBlue"
            text="Reset"
            Icon={() => <HistoryIcon className="fill-klerosUIComponentsPrimaryBlue" />}
            onClick={resetFields}
          />
        </div>
      </div>
      <ItemFields />
      <PlusMinusField
        className="self-start"
        currentValue={listMetadata.columns?.length ?? 2}
        updateValue={updateNumberOfFields}
        minValue={1}
      />
      <NavigationButtons prevRoute="/submit-list/deposit" nextRoute="/submit-list/item-preview" />
    </div>
  );
};
export default Fields;
