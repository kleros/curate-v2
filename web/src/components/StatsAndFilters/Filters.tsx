import React from "react";
import styled, { css } from "styled-components";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { hoverShortTransitionTiming } from "styles/commonStyles";

import { DropdownSelect } from "@kleros/ui-components-library";

import { useIsListView } from "context/IsListViewProvider";
import ListIcon from "svgs/icons/list.svg";
import GridIcon from "svgs/icons/grid.svg";
import { useItemRootPath, useListRootPath } from "utils/uri";
import useIsDesktop from "hooks/useIsDesktop";

const Container = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  width: fit-content;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const BaseIconStyles = css`
  ${hoverShortTransitionTiming}
  cursor: pointer;
  fill: ${({ theme }) => theme.primaryBlue};
  width: 16px;
  height: 16px;
  overflow: hidden;

  :hover {
    fill: ${({ theme }) => theme.secondaryBlue};
  }
`;

const StyledGridIcon = styled(GridIcon)`
  ${BaseIconStyles}
`;

const StyledListIcon = styled(ListIcon)`
  ${BaseIconStyles}
`;

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
    <Container>
      <DropdownSelect
        smallButton
        simpleButton
        items={[
          { value: "desc", text: "Newest" },
          { value: "asc", text: "Oldest" },
        ]}
        defaultValue={order}
        callback={handleOrderChange}
      />
      {isDesktop && isListFilter ? (
        <IconsContainer>
          {isListView ? (
            <StyledGridIcon onClick={() => setIsListView(false)} />
          ) : (
            <StyledListIcon
              onClick={() => {
                if (isDesktop) {
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
