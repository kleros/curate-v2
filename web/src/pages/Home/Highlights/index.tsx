import React, { useContext, useMemo } from "react";
import styled from "styled-components";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";
import { Button } from "@kleros/ui-components-library";
import { lists } from "consts/index";
import Header from "./Header";
import RegistryCard from "components/RegistryCard";
import { useIsList } from "context/IsListProvider";
import { OverlayScrollContext } from "context/OverlayScrollContext";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
`;

const GridContainer = styled.div`
  --gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, max(274px, (100% - var(--gap) * 2)/3)), 1fr));
  align-items: center;
  gap: var(--gap);
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const StyledButton = styled(Button)`
  margin: 0 auto;
`;

const useNavigateAndScrollTop = () => {
  const navigate = useNavigate();
  const osInstanceRef = useContext(OverlayScrollContext);

  const navigateAndScrollTop = (path) => {
    navigate(path);
    osInstanceRef?.current?.osInstance().elements().viewport.scroll({ top: 0 });
  };

  return navigateAndScrollTop;
};

const HighlightedLists: React.FC = () => {
  const navigateAndScrollTop = useNavigateAndScrollTop();
  const { isList } = useIsList();
  const { width } = useWindowSize();
  const screenIsBig = useMemo(() => width > BREAKPOINT_LANDSCAPE, [width]);

  return (
    <Container>
      <Header />

      {isList && screenIsBig ? (
        <ListContainer>
          {lists.map((list, i) => (
            <RegistryCard {...list} />
          ))}
        </ListContainer>
      ) : (
        <GridContainer>
          {lists.map((list, i) => (
            <RegistryCard {...list} />
          ))}
        </GridContainer>
      )}
      <StyledButton
        onClick={() => navigateAndScrollTop("/lists/display/1/desc/all")}
        text="Show All"
        variant="secondary"
      />
    </Container>
  );
};

export default HighlightedLists;
