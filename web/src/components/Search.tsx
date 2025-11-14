import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Searchbar, DropdownSelect, Button } from "@kleros/ui-components-library";
import { decodeListURIFilter, encodeListURIFilter, useListRootPath } from "utils/uri";
import PaperIcon from "svgs/icons/paper.svg";
import PlusIcon from "svgs/icons/plus.svg";
import { List_filters } from "consts/filters";

const Search: React.FC<{ isList?: Boolean }> = ({ isList }) => {
  const { page, order, filter, id } = useParams();
  const location = useListRootPath();
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");

  const decodedFilter = decodeListURIFilter(filter ?? "all");
  const [search, setSearch] = useState(keywords ?? undefined);
  const navigate = useNavigate();

  useDebounce(
    () => {
      const searchableText = search?.replace(/ /g, "|");

      const encodedFilter = encodeListURIFilter(decodedFilter);
      navigate(`${location}/${page}/${order}/${encodedFilter}${search ? `?keywords=${searchableText}` : ""}`);
    },
    500,
    [search]
  );

  const handleStatusChange = (value: string | number) => {
    const filter = JSON.parse(value as string);
    const encodedFilter = encodeListURIFilter(filter);
    navigate(`${location}/1/${order}/${encodedFilter}${keywords ? "?keywords=" + keywords : ""}`);
  };

  return (
    <div className="flex flex-col flex-wrap gap-4 mb-4 lg:flex-row">
      <div className="flex flex-1 flex-wrap gap-2 z-0">
        <Searchbar
          className="flex-1 basis-[310px] [&_input]:py-0"
          type="text"
          placeholder="Search by keywords"
          value={search}
          onChange={(value) => setSearch(value)}
        />
      </div>
      <DropdownSelect
        items={[
          { id: JSON.stringify({}), text: "All Status", dot: "grey", itemValue: JSON.stringify({}) },
          {
            id: JSON.stringify(List_filters.Active),
            text: "Active",
            dot: "orange",
            itemValue: JSON.stringify(List_filters.Active),
          },
          {
            id: JSON.stringify(List_filters.Pending),
            text: "Pending",
            dot: "blue",
            itemValue: JSON.stringify(List_filters.Pending),
          },
          {
            id: JSON.stringify(List_filters.Disputed),
            text: "Disputed",
            dot: "purple",
            itemValue: JSON.stringify(List_filters.Disputed),
          },
          {
            id: JSON.stringify(List_filters.Included),
            text: "Included",
            dot: "green",
            itemValue: JSON.stringify(List_filters.Included),
          },
          {
            id: JSON.stringify(List_filters.Removed),
            text: "Removed",
            dot: "red",
            itemValue: JSON.stringify(List_filters.Removed),
          },
        ]}
        defaultSelectedKey={JSON.stringify(decodedFilter)}
        callback={(item) => handleStatusChange(item.itemValue)}
      />
      {isList ? (
        <Button text="Create New List" Icon={PaperIcon} onClick={() => navigate("/submit-list")} />
      ) : (
        <Button Icon={PlusIcon} text="Submit Item" onClick={() => navigate(`/submit-item/${id}`)} />
      )}
    </div>
  );
};

export default Search;
