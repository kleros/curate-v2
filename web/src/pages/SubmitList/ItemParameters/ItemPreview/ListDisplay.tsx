import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import ItemCard from "components/ItemCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { constructItemWithMockValues } from "utils/submitListUtils";

interface IListDisplay {}

const ListDisplay: React.FC<IListDisplay> = ({}) => {
  const { listMetadata } = useSubmitListContext();
  const item = constructItemWithMockValues(listMetadata);

  return (
    <div className="flex flex-col" style={{ gap: responsiveSize(32, 24) }}>
      <p className="m-0 text-klerosUIComponentsPrimaryBlue">Check how the item is displayed on the List page:</p>
      <ItemCard {...item} />
    </div>
  );
};
export default ListDisplay;
