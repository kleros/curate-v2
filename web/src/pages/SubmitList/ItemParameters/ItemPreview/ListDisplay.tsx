import React from "react";
import ItemCard from "components/ItemCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { constructItemWithMockValues } from "utils/submitListUtils";

interface IListDisplay {}

const ListDisplay: React.FC<IListDisplay> = ({}) => {
  const { listMetadata } = useSubmitListContext();
  const item = constructItemWithMockValues(listMetadata);

  return (
    <div className="flex flex-col gap-fluid-32-24">
      <p className="text-klerosUIComponentsPrimaryBlue">Check how the item is displayed on the List page:</p>
      <ItemCard {...item} />
    </div>
  );
};
export default ListDisplay;
