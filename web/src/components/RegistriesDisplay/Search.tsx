import React, { useState } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Searchbar, DropdownSelect, Button } from "@kleros/ui-components-library";
import { decodeListURIFilter, encodeListURIFilter, useListRootPath } from "utils/uri";
import PaperIcon from "svgs/icons/paper.svg";
import { List_filters } from "consts/filters";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  ${landscapeStyle(
    () =>
      css`
        flex-direction: row;
      `
  )}
`;

const SearchBarContainer = styled.div`
  display: flex;
  flex: 1;
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

const StyledPaperIcon = styled(PaperIcon)`
  path {
    fill: ${({ theme }) => theme.whiteBackground};
  }
`;

const Search: React.FC = () => {
  const { page, order, filter } = useParams();
  const location = useListRootPath();
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");

  const decodedFilter = decodeListURIFilter(filter ?? "all");
  const [search, setSearch] = useState(keywords);
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
    navigate(`${location}/${page}/${order}/${encodedFilter}${keywords ? "?keywords=" + keywords : ""}`);
  };

  return (
    <Container>
      <SearchBarContainer>
        <StyledSearchbar
          type="text"
          placeholder="Search by keywords"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBarContainer>
      <DropdownSelect
        items={[
          { text: "All Status", dot: "grey", value: JSON.stringify({}) },
          {
            text: "Pending",
            dot: "blue",
            value: JSON.stringify(List_filters.Pending),
          },
          { text: "Disputed", dot: "purple", value: JSON.stringify(List_filters.Disputed) },
          { text: "Included", dot: "green", value: JSON.stringify(List_filters.Included) },
          { text: "Removed", dot: "red", value: JSON.stringify(List_filters.Removed) },
        ]}
        defaultValue={JSON.stringify(decodedFilter)}
        callback={handleStatusChange}
      />
      <Button text="Create New List" Icon={StyledPaperIcon} onClick={() => navigate("/submit-list")} />
    </Container>
  );
};

export default Search;
