import React from "react";
import styled from "styled-components";
import Header from "./Header";
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HighlightedLists: React.FC = () => {
  return (
    <Container>
      <Header />
    </Container>
  );
};
export default HighlightedLists;
