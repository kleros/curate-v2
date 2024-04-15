import React, { useState } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Searchbar, DropdownSelect, Button } from "@kleros/ui-components-library";
import { decodeListURIFilter, encodeListURIFilter, useListRootPath } from "utils/uri";
import { StyledGlobeIcon } from "../StyledIcons/GlobeIcon";
import { StyledEthereumIcon } from "../StyledIcons/EthereumIcon";
import { StyledGnosisIcon } from "../StyledIcons/GnosisIcon";
import { StyledPolygonIcon } from "../StyledIcons/PolygonIcon";
import PaperIcon from "svgs/icons/paper.svg";

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
  const decodedFilter = decodeListURIFilter(filter ?? "all");
  const { id: searchValue, ...filterObject } = decodedFilter;
  const [search, setSearch] = useState(searchValue ?? "");
  const navigate = useNavigate();
  useDebounce(
    () => {
      const newFilters = search === "" ? { ...filterObject } : { ...filterObject, id: search };
      const encodedFilter = encodeListURIFilter(newFilters);
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
          { text: "All Networks", value: 1, Icon: StyledGlobeIcon },
          { text: "Ethereum", value: 2, Icon: StyledEthereumIcon },
          { text: "Gnosis", value: 3, Icon: StyledGnosisIcon },
          { text: "Polygon", value: 4, Icon: StyledPolygonIcon },
        ]}
        defaultValue={1}
        callback={() => {}}
      />
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
      <Button text="Create New List" Icon={StyledPaperIcon} onClick={() => navigate("/submitList")} />
    </Container>
  );
};

export default Search;
