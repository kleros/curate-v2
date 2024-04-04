import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import { DropdownSelect } from "@kleros/ui-components-library";
import { useIsListView } from "context/IsListViewProvider";
import ListIcon from "svgs/icons/list.svg";
import GridIcon from "svgs/icons/grid.svg";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useItemRootPath, useListRootPath } from "utils/uri";

const Container = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  width: fit-content;
`;

const StyledGridIcon = styled(GridIcon)`
  cursor: pointer;
  transition: filter 0.2s ease;
  fill: ${({ theme }) => theme.primaryBlue};
  width: 16px;
  height: 16px;
  overflow: hidden;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const StyledListIcon = styled(ListIcon)`
  cursor: pointer;
  transition: filter 0.2s ease;
  fill: ${({ theme }) => theme.primaryBlue};
  width: 16px;
  height: 16px;
  overflow: hidden;
`;
export interface IFilters {
  isListFilter: boolean;
}
const Filters: React.FC<IFilters> = ({ isListFilter = false }) => {
  const { order, filter } = useParams();
  const navigate = useNavigate();
  const locationAllLists = useListRootPath();
  const locationList = useItemRootPath();

  const handleOrderChange = (value: string | number) => {
    navigate(`${isListFilter ? locationAllLists : locationList}/1/${value}/${filter}`);
  };

  const { width } = useWindowSize();
  const { isListView, setIsListView } = useIsListView();
  const screenIsBig = width > BREAKPOINT_LANDSCAPE;

  return (
    <Container>
      <DropdownSelect
        smallButton
        simpleButton
        alignRight
        items={[
          { value: "desc", text: "Most Active" },
          { value: "desc", text: "Newest" },
          { value: "asc", text: "Oldest" },
        ]}
        defaultValue={order}
        callback={handleOrderChange}
      />
      {screenIsBig && isListFilter ? (
        <IconsContainer>
          {isListView ? (
            <StyledGridIcon onClick={() => setIsListView(false)} />
          ) : (
            <StyledListIcon
              onClick={() => {
                if (screenIsBig) {
                  setIsListView(true);
                }
              }}
            />
          )}
        </IconsContainer>
      ) : null}
    </Container>
  );
};

export default Filters;
