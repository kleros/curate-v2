import React, { useState } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Searchbar, DropdownSelect, Button } from "@kleros/ui-components-library";
import { decodeItemURIFilter, encodeItemURIFilter, useItemRootPath } from "utils/uri";
import PlusIcon from "svgs/icons/plus.svg";

const StyledPlusIcon = styled(PlusIcon)`
  path {
    fill: ${({ theme }) => theme.whiteBackground};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;

  ${landscapeStyle(
    () =>
      css`
        flex-direction: row;
      `
  )}
`;

const SearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  z-index: 0;
`;

const StyledSearchbar = styled(Searchbar)`
  flex: 1;
  flex-basis: 310px;
  input {
    font-size: 16px;
    height: 45px;
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;

const Search: React.FC = () => {
  const { page, order, filter, id } = useParams();

  const location = useItemRootPath();
  const decodedFilter = decodeItemURIFilter(filter ?? "all");
  const { id: searchValue, ...filterObject } = decodedFilter;
  const [search, setSearch] = useState(searchValue ?? "");
  const navigate = useNavigate();
  useDebounce(
    () => {
      const newFilters = search === "" ? { ...filterObject } : { ...filterObject, id: search };
      const encodedFilter = encodeItemURIFilter(newFilters);
      navigate(`${location}/${page}/${order}/${encodedFilter}`);
    },
    500,
    [search]
  );

  return (
    <Container>
      <SearchBarContainer>
        <StyledSearchbar
          type="text"
          placeholder="Search By ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBarContainer>
      <DropdownSelect
        items={[
          { text: "All Status", dot: "grey", value: 1 },
          { text: "Pending", dot: "blue", value: 2 },
          { text: "Disputed", dot: "purple", value: 3 },
          { text: "Included", dot: "green", value: 4 },
          { text: "Removed", dot: "red", value: 5 },
        ]}
        defaultValue={1}
        callback={() => {}}
      />
      <Button Icon={StyledPlusIcon} text="Submit Item" onClick={() => navigate(`/submit-item/${id}`)} />
    </Container>
  );
};

export default Search;
