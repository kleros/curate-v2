import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { lists } from "consts/index";
import ListCard from "components/ListCard";
import { Button } from "@kleros/ui-components-library";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
`;

const ListsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
`;

const StyledButton = styled(Button)`
  margin: 0 auto;
`;

const HighlightedLists: React.FC = () => {
  return (
    <Container>
      <Header />
      <ListsContainer>
        {lists.map((list, i) => (
          <ListCard {...list} />
        ))}
      </ListsContainer>
      <StyledButton text="Show All" variant="secondary" />
    </Container>
  );
};
export default HighlightedLists;
