import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { DropdownSelect } from "@kleros/ui-components-library";

import { useIsListView } from "context/IsListViewProvider";
import ListIcon from "svgs/icons/list.svg";
import GridIcon from "svgs/icons/grid.svg";
import { useItemRootPath, useListRootPath } from "utils/uri";
import useIsDesktop from "hooks/useIsDesktop";

export interface IFilters {
  isListFilter?: boolean;
}

const Filters: React.FC<IFilters> = ({ isListFilter = false }) => {
  const { order, filter } = useParams();
  const navigate = useNavigate();
  const locationAllLists = useListRootPath();
  const locationList = useItemRootPath();
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");

  const handleOrderChange = (value: string | number) => {
    navigate(
      `${isListFilter ? locationAllLists : locationList}/1/${value}/${filter}${keywords ? "?keywords=" + keywords : ""}`
    );
  };

  const { isListView, setIsListView } = useIsListView();
  const isDesktop = useIsDesktop();

  return (
    <div className="flex justify-end gap-3 w-fit **:focus:shadow-none">
      <DropdownSelect
        className="self-center [&_button]:p-0"
        smallButton
        simpleButton
        items={[
          { id: "desc", itemValue: "desc", text: "Newest" },
          { id: "asc", itemValue: "asc", text: "Oldest" },
        ]}
        defaultSelectedKey={order}
        callback={(item) => handleOrderChange(item.itemValue)}
      />
      {isDesktop && isListFilter ? (
        <div className="flex justify-center items-center gap-1">
          {isListView ? (
            <GridIcon
              className="w-4 h-4 overflow-hidden cursor-pointer fill-klerosUIComponentsPrimaryBlue hover:fill-klerosUIComponentsSecondaryBlue transition duration-100"
              onClick={() => setIsListView(false)}
            />
          ) : (
            <ListIcon
              className="w-4 h-4 overflow-hidden cursor-pointer fill-klerosUIComponentsPrimaryBlue hover:fill-klerosUIComponentsSecondaryBlue transition duration-100"
              onClick={() => {
                if (isDesktop) {
                  setIsListView(true);
                }
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Filters;
