import React from "react";
import styled, { useTheme } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import { DropdownSelect } from "@kleros/ui-components-library";
import { useIsList } from "context/IsListProvider";
import ListIcon from "svgs/icons/list.svg";
import GridIcon from "svgs/icons/grid.svg";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { decodeListURIFilter, encodeListURIFilter, useListRootPath } from "utils/uri";

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

const Filters: React.FC = () => {
  const theme = useTheme();
  const { order, filter } = useParams();
  const { ruled, period, ...filterObject } = decodeListURIFilter(filter ?? "all");
  const navigate = useNavigate();
  const location = useListRootPath();

  const handleStatusChange = (value: string | number) => {
    const parsedValue = JSON.parse(value as string);
    const encodedFilter = encodeListURIFilter({ ...filterObject, ...parsedValue });
    navigate(`${location}/1/${order}/${encodedFilter}`);
  };

  const handleOrderChange = (value: string | number) => {
    const encodedFilter = encodeListURIFilter({ ruled, period, ...filterObject });
    navigate(`${location}/1/${value}/${encodedFilter}`);
  };

  const { width } = useWindowSize();
  const { isList, setIsList } = useIsList();
  const screenIsBig = width > BREAKPOINT_LANDSCAPE;

  return (
    <Container>
      <DropdownSelect
        smallButton
        simpleButton
        items={[
          { value: "desc", text: "Most Active" },
          { value: "desc", text: "Newest" },
          { value: "asc", text: "Oldest" },
        ]}
        defaultValue={order}
        callback={handleOrderChange}
      />
      {screenIsBig ? (
        <IconsContainer>
          {isList ? (
            <StyledGridIcon onClick={() => setIsList(false)} />
          ) : (
            <StyledListIcon
              onClick={() => {
                if (screenIsBig) {
                  setIsList(true);
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
